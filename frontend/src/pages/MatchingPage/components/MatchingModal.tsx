import { Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
  MagnifyingGlassIcon,
  WifiIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useContext } from "react";
import { MatchingContext } from "../../../context/MatchingContext";
import classNames from "../../../util/ClassNames";
import titleCase from "../../../util/titleCase";
import StateHoc from "../../../components/StateHoc";

interface IModalProps {
  difficulty: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  connectionLoading: boolean;
  connectionSuccess: boolean;
  matchLoading: boolean;
  matchSuccess: boolean;
  cancelMatch: () => void;
}
function MatchingModal({
  difficulty,
  open,
  setOpen,
  connectionLoading,
  connectionSuccess,
  matchLoading,
  matchSuccess,
  cancelMatch,
}: IModalProps) {
  const { matchedUserId } = useContext(MatchingContext);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="flex flex-col mt-3 text-center justify-center items-center sm:mt-5">
                  {matchLoading && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                  <div className="mt-5">
                    <p className="text-sm text-gray-500">
                      {`Difficulty Chosen: ${titleCase(difficulty)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {matchLoading ? "Matching..." : ""}
                      {matchSuccess
                        ? `Match Found! ${matchedUserId}`
                        : "No Match Found!"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <ul className="-mb-8">
                    <li>
                      <div className="relative pb-8">
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={classNames(
                                connectionLoading ? "bg-gray-400" : "",
                                connectionSuccess
                                  ? "bg-green-500"
                                  : "bg-red-500",
                                "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                              )}
                            >
                              <StateHoc
                                isLoading={connectionLoading}
                                isSuccess={connectionSuccess}
                                loadingComponent={
                                  <WifiIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                }
                                successComponent={
                                  <CheckIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                }
                                failureComponent={
                                  <XCircleIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                }
                              />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                {connectionLoading
                                  ? "Establishing Connection..."
                                  : "Connection Established"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={classNames(
                                matchLoading ? "bg-gray-400" : "",
                                matchSuccess ? "bg-green-500" : "bg-red-500",
                                "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                              )}
                            >
                              <StateHoc
                                isLoading={matchLoading}
                                isSuccess={matchSuccess}
                                loadingComponent={
                                  <MagnifyingGlassIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                }
                                successComponent={
                                  <CheckIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                }
                                failureComponent={
                                  <XCircleIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                }
                              />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                {matchLoading ? "Finding Match..." : ""}
                                {matchSuccess
                                  ? "Match Found!"
                                  : "No Match Found!"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      setOpen(false);
                      cancelMatch();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default MatchingModal;
