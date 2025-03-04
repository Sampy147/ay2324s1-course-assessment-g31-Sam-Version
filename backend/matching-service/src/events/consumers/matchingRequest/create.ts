import { MatchingRequest } from "@prisma/client";

import { Matching } from "../../../interfaces/matching/object";
import MatchingService from "../../../services/matching/matching.service";
import MatchingRequestService from "../../../services/matchingRequest/matchingRequest.service";
import prismaClient from "../../../util/prisma/client";
import MatchingProducer from "../../producers/matching/producer";
import MatchingRequestProducer from "../../producers/matchingRequest/producer";
import { ConsumerFunction } from "../main.interface";
import kafka from "../../kafka";
import logger from "../../../util/logger";

const matchingEventProducer = new MatchingProducer(kafka.producer());
const matchingRequestEventProducer = new MatchingRequestProducer(
  kafka.producer(),
);
const matchingService = new MatchingService(prismaClient);
const matchingRequestService = new MatchingRequestService(prismaClient);

const createMatchingRequestConsumer: ConsumerFunction = async (message) => {
  logger.info(
    "WE HAVE RECEIVED A MESSAGE FOR THE CREATION OF A MATCHING REQUEST",
  );
  if (message.value) {
    // Parse the json message
    const inputMatchingReq: MatchingRequest = JSON.parse(
      message.value.toString(),
    );

    const matchReqFromDB: MatchingRequest | null =
      await matchingRequestService.findOne(inputMatchingReq);

    if (!matchReqFromDB || matchReqFromDB.success) {
      return;
    }

    const counterPartyMatchReq: MatchingRequest | null =
      await matchingService.findMatch(matchReqFromDB);

    if (!counterPartyMatchReq) {
      matchingRequestEventProducer.fail(matchReqFromDB);
      return;
    }

    const matching: Matching = await matchingService.create({
      user1Id: counterPartyMatchReq.userId,
      user2Id: matchReqFromDB.userId,
      requestId: matchReqFromDB.id,
      difficulty: matchReqFromDB.difficulty,
      questionIdRequested: matchReqFromDB.questionId,
    });

    // Update matching request
    await matchingRequestService.update(counterPartyMatchReq.id, {
      ...counterPartyMatchReq,
      success: true,
    });

    await matchingRequestService.update(matchReqFromDB.id, {
      ...matchReqFromDB,
      success: true,
    });

    matchingEventProducer.create(matching);
  }
};

export default createMatchingRequestConsumer;
