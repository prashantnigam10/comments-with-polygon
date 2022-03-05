import * as wagmi from "wagmi";
import { useProvider, useSigner } from "wagmi";
import type { BigNumber } from "ethers";
import CommentsContract from "../artifacts/contracts/Comments.sol/Comments.json";

export interface Comment {
    id: string;
    topic: string;
    message: string;
    creator_address: string;
    created_at: BigNumber;
  }

  export enum EventType {
    CommentAdded = "CommentAdded",
  }

  const useCommentsContract = () => {
    const [signer] = useSigner();
    const provider = useProvider();

    const contract = wagmi.useContract({
        addressOrName: "0x9487359eFB961fa7Fc3206910bFbC160447ccB4b",
        contractInterface: CommentsContract.abi,
        signerOrProvider: signer.data || provider,
      });

        // Wrapper to add types to our getComments function.
  const getComments = async (topic: string): Promise<Comment[]> => {
    return contract.getComments(topic).then((comments) => {
      // Each comment is represented as array by default so we convert to object
      return comments.map((c) => ({ ...c }));
    });
  };

  // Wrapper to add types to our addComment function.
  const addComment = async (topic: string, message: string): Promise<void> => {
    // Create a new transaction
    const tx = await contract.addComment(topic, message);
    // Wait for transaction to be mined
    await tx.wait();
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getComments,
    addComment,
  };
  }

  export default useCommentsContract;