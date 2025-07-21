// Auto-generated TypeScript types from NEAR OpenAPI spec using z.infer
// Generated on: 2025-07-21T14:55:01.185Z
// Do not edit manually - run 'pnpm generate' to regenerate

import { z } from 'zod/v4';
import * as schemas from './schemas';

/**
 * Access key provides limited access to an account. Each access key belongs
 * to some account and is identified by a unique (within the account) public
 * key. One account may have large number of access keys. Access keys allow to
 * act on behalf of the account by restricting transactions that can be
 * issued. `account_id,public_key` is a key in the state
 */
export type AccessKey = z.infer<typeof schemas.AccessKeySchema>;

/** Describes the cost of creating an access key. */
export type AccessKeyCreationConfigView = z.infer<typeof schemas.AccessKeyCreationConfigViewSchema>;

/** Describes information about an access key including the public key. */
export type AccessKeyInfoView = z.infer<typeof schemas.AccessKeyInfoViewSchema>;

/** Lists access keys */
export type AccessKeyList = z.infer<typeof schemas.AccessKeyListSchema>;

/** Defines permissions for AccessKey */
export type AccessKeyPermission = z.infer<typeof schemas.AccessKeyPermissionSchema>;

/**
 * Describes the permission scope for an access key. Whether it is a function
 * call or a full access key.
 */
export type AccessKeyPermissionView = z.infer<typeof schemas.AccessKeyPermissionViewSchema>;

/** Describes access key permission scope and nonce. */
export type AccessKeyView = z.infer<typeof schemas.AccessKeyViewSchema>;

/** The structure describes configuration for creation of new accounts. */
export type AccountCreationConfigView = z.infer<typeof schemas.AccountCreationConfigViewSchema>;

/**
 * AccountData is a piece of global state that a validator signs and
 * broadcasts to the network. It is essentially the data that a validator
 * wants to share with the network. All the nodes in the network are
 * collecting the account data broadcasted by the validators. Since the number
 * of the validators is bounded and their identity is known (and the maximal
 * size of allowed AccountData is bounded) the global state that is
 * distributed in the form of AccountData is bounded as well. Find more
 * information in the docs
 * [here](https://github.com/near/nearcore/blob/560f7fc8f4b3106e0d5d46050688610b1f104ac6/chain/client/src/client.rs#L2232)
 */
export type AccountDataView = z.infer<typeof schemas.AccountDataViewSchema>;

/**
 * NEAR Account Identifier. This is a unique, syntactically valid,
 * human-readable account identifier on the NEAR network. [See the crate-level
 * docs for information about validation.](index.html#account-id-rules) Also
 * see [Error kind precedence](AccountId#error-kind-precedence). ## Examples
 * ``` use near_account_id::AccountId; let alice: AccountId =
 * "alice.near".parse().unwrap();
 * assert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f) ```
 */
export type AccountId = z.infer<typeof schemas.AccountIdSchema>;

export type AccountIdValidityRulesVersion = z.infer<typeof schemas.AccountIdValidityRulesVersionSchema>;

/** Account info for validators */
export type AccountInfo = z.infer<typeof schemas.AccountInfoSchema>;

/** A view of the account */
export type AccountView = z.infer<typeof schemas.AccountViewSchema>;

/** Account ID with its public key. */
export type AccountWithPublicKey = z.infer<typeof schemas.AccountWithPublicKeySchema>;

export type Action = z.infer<typeof schemas.ActionSchema>;

/**
 * Describes the cost of creating a specific action, `Action`. Includes all
 * variants.
 */
export type ActionCreationConfigView = z.infer<typeof schemas.ActionCreationConfigViewSchema>;

/** An error happened during Action execution */
export type ActionError = z.infer<typeof schemas.ActionErrorSchema>;

export type ActionErrorKind = z.infer<typeof schemas.ActionErrorKindSchema>;

export type ActionView = z.infer<typeof schemas.ActionViewSchema>;

/** Describes the error for validating a list of actions. */
export type ActionsValidationError = z.infer<typeof schemas.ActionsValidationErrorSchema>;

/** An action that adds key with public key associated */
export type AddKeyAction = z.infer<typeof schemas.AddKeyActionSchema>;

/**
 * `BandwidthRequest` describes the size of receipts that a shard would like
 * to send to another shard. When a shard wants to send a lot of receipts to
 * another shard, it needs to create a request and wait for a bandwidth grant
 * from the bandwidth scheduler.
 */
export type BandwidthRequest = z.infer<typeof schemas.BandwidthRequestSchema>;

/**
 * Bitmap which describes which values from the predefined list are being
 * requested. The nth bit is set to 1 when the nth value from the list is
 * being requested.
 */
export type BandwidthRequestBitmap = z.infer<typeof schemas.BandwidthRequestBitmapSchema>;

/**
 * A list of shard's bandwidth requests. Describes how much the shard would
 * like to send to other shards.
 */
export type BandwidthRequests = z.infer<typeof schemas.BandwidthRequestsSchema>;

/** Version 1 of [`BandwidthRequest`]. */
export type BandwidthRequestsV1 = z.infer<typeof schemas.BandwidthRequestsV1Schema>;

/**
 * A part of a state for the current head of a light client. More info
 * [here](https://nomicon.io/ChainSpec/LightClient).
 */
export type BlockHeaderInnerLiteView = z.infer<typeof schemas.BlockHeaderInnerLiteViewSchema>;

/** Contains main info about the block. */
export type BlockHeaderView = z.infer<typeof schemas.BlockHeaderViewSchema>;

export type BlockId = z.infer<typeof schemas.BlockIdSchema>;

/** Height and hash of a block */
export type BlockStatusView = z.infer<typeof schemas.BlockStatusViewSchema>;

/** A result returned by contract method */
export type CallResult = z.infer<typeof schemas.CallResultSchema>;

/**
 * Status of the
 * [catchup](https://near.github.io/nearcore/architecture/how/sync.html#catchup)
 * process
 */
export type CatchupStatusView = z.infer<typeof schemas.CatchupStatusViewSchema>;

/**
 * Config for the Chunk Distribution Network feature. This allows nodes to
 * push and pull chunks from a central stream. The two benefits of this
 * approach are: (1) less request/response traffic on the peer-to-peer network
 * and (2) lower latency for RPC nodes indexing the chain.
 */
export type ChunkDistributionNetworkConfig = z.infer<typeof schemas.ChunkDistributionNetworkConfigSchema>;

/** URIs for the Chunk Distribution Network feature. */
export type ChunkDistributionUris = z.infer<typeof schemas.ChunkDistributionUrisSchema>;

/** Contains main info about the chunk. */
export type ChunkHeaderView = z.infer<typeof schemas.ChunkHeaderViewSchema>;

export type CompilationError = z.infer<typeof schemas.CompilationErrorSchema>;

/**
 * The configuration for congestion control. More info about congestion
 * [here](https://near.github.io/nearcore/architecture/how/receipt-congestion.html?highlight=congestion#receipt-congestion)
 */
export type CongestionControlConfigView = z.infer<typeof schemas.CongestionControlConfigViewSchema>;

/**
 * Stores the congestion level of a shard. More info about congestion
 * [here](https://near.github.io/nearcore/architecture/how/receipt-congestion.html?highlight=congestion#receipt-congestion)
 */
export type CongestionInfoView = z.infer<typeof schemas.CongestionInfoViewSchema>;

/** A view of the contract code. */
export type ContractCodeView = z.infer<typeof schemas.ContractCodeViewSchema>;

/**
 * Shows gas profile. More info
 * [here](https://near.github.io/nearcore/architecture/gas/gas_profile.html?highlight=WASM_HOST_COST#example-transaction-gas-profile).
 */
export type CostGasUsed = z.infer<typeof schemas.CostGasUsedSchema>;

/** Create account action */
export type CreateAccountAction = z.infer<typeof schemas.CreateAccountActionSchema>;

export type CryptoHash = z.infer<typeof schemas.CryptoHashSchema>;

/** Describes information about the current epoch validator */
export type CurrentEpochValidatorInfo = z.infer<typeof schemas.CurrentEpochValidatorInfoSchema>;

/** The fees settings for a data receipt creation */
export type DataReceiptCreationConfigView = z.infer<typeof schemas.DataReceiptCreationConfigViewSchema>;

export type DataReceiverView = z.infer<typeof schemas.DataReceiverViewSchema>;

/** This action allows to execute the inner actions behalf of the defined sender. */
export type DelegateAction = z.infer<typeof schemas.DelegateActionSchema>;

export type DeleteAccountAction = z.infer<typeof schemas.DeleteAccountActionSchema>;

export type DeleteKeyAction = z.infer<typeof schemas.DeleteKeyActionSchema>;

/** Deploy contract action */
export type DeployContractAction = z.infer<typeof schemas.DeployContractActionSchema>;

/** Deploy global contract action */
export type DeployGlobalContractAction = z.infer<typeof schemas.DeployGlobalContractActionSchema>;

export type DetailedDebugStatus = z.infer<typeof schemas.DetailedDebugStatusSchema>;

export type Direction = z.infer<typeof schemas.DirectionSchema>;

/** Configures how to dump state to external storage. */
export type DumpConfig = z.infer<typeof schemas.DumpConfigSchema>;

export type DurationAsStdSchemaProvider = z.infer<typeof schemas.DurationAsStdSchemaProviderSchema>;

/**
 * Epoch identifier -- wrapped hash, to make it easier to distinguish. EpochId
 * of epoch T is the hash of last block in T-2 EpochId of first two epochs is
 * 0
 */
export type EpochId = z.infer<typeof schemas.EpochIdSchema>;

export type EpochSyncConfig = z.infer<typeof schemas.EpochSyncConfigSchema>;

export type ExecutionMetadataView = z.infer<typeof schemas.ExecutionMetadataViewSchema>;

export type ExecutionOutcomeView = z.infer<typeof schemas.ExecutionOutcomeViewSchema>;

export type ExecutionOutcomeWithIdView = z.infer<typeof schemas.ExecutionOutcomeWithIdViewSchema>;

export type ExecutionStatusView = z.infer<typeof schemas.ExecutionStatusViewSchema>;

/**
 * Typed view of ExtCostsConfig to preserve JSON output field names in
 * protocol config RPC output.
 */
export type ExtCostsConfigView = z.infer<typeof schemas.ExtCostsConfigViewSchema>;

export type ExternalStorageConfig = z.infer<typeof schemas.ExternalStorageConfigSchema>;

export type ExternalStorageLocation = z.infer<typeof schemas.ExternalStorageLocationSchema>;

/**
 * Costs associated with an object that can only be sent over the network (and
 * executed by the receiver). NOTE: `send_sir` or `send_not_sir` fees are
 * usually burned when the item is being created. And `execution` fee is
 * burned when the item is being executed.
 */
export type Fee = z.infer<typeof schemas.FeeSchema>;

/**
 * Execution outcome of the transaction and all the subsequent receipts. Could
 * be not finalized yet
 */
export type FinalExecutionOutcomeView = z.infer<typeof schemas.FinalExecutionOutcomeViewSchema>;

/**
 * Final execution outcome of the transaction and all of subsequent the
 * receipts. Also includes the generated receipt.
 */
export type FinalExecutionOutcomeWithReceiptView = z.infer<typeof schemas.FinalExecutionOutcomeWithReceiptViewSchema>;

export type FinalExecutionStatus = z.infer<typeof schemas.FinalExecutionStatusSchema>;

/** Different types of finality. */
export type Finality = z.infer<typeof schemas.FinalitySchema>;

/**
 * This type is used to mark function arguments. NOTE: The main reason for
 * this to exist (except the type-safety) is that the value is transparently
 * serialized and deserialized as a base64-encoded string when serde is used
 * (serde_json).
 */
export type FunctionArgs = z.infer<typeof schemas.FunctionArgsSchema>;

export type FunctionCallAction = z.infer<typeof schemas.FunctionCallActionSchema>;

/**
 * Serializable version of `near-vm-runner::FunctionCallError`. Must never
 * reorder/remove elements, can only add new variants at the end (but do that
 * very carefully). It describes stable serialization format, and only used by
 * serialization logic.
 */
export type FunctionCallError = z.infer<typeof schemas.FunctionCallErrorSchema>;

/**
 * Grants limited permission to make transactions with FunctionCallActions The
 * permission can limit the allowed balance to be spent on the prepaid gas. It
 * also restrict the account ID of the receiver for this function call. It
 * also can restrict the method name for the allowed function calls.
 */
export type FunctionCallPermission = z.infer<typeof schemas.FunctionCallPermissionSchema>;

/** Configuration for garbage collection. */
export type GCConfig = z.infer<typeof schemas.GCConfigSchema>;

export type GasKeyView = z.infer<typeof schemas.GasKeyViewSchema>;

export type GenesisConfig = z.infer<typeof schemas.GenesisConfigSchema>;

export type GenesisConfigRequest = z.infer<typeof schemas.GenesisConfigRequestSchema>;

export type GlobalContractDeployMode = z.infer<typeof schemas.GlobalContractDeployModeSchema>;

export type GlobalContractIdentifier = z.infer<typeof schemas.GlobalContractIdentifierSchema>;

export type HostError = z.infer<typeof schemas.HostErrorSchema>;

export type InvalidAccessKeyError = z.infer<typeof schemas.InvalidAccessKeyErrorSchema>;

/** An error happened during TX execution */
export type InvalidTxError = z.infer<typeof schemas.InvalidTxErrorSchema>;

export type JsonRpcRequestFor_EXPERIMENTALChanges = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALChangesSchema>;

export type JsonRpcRequestFor_EXPERIMENTALChangesInBlock = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALChangesInBlockSchema>;

export type JsonRpcRequestFor_EXPERIMENTALCongestionLevel = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALCongestionLevelSchema>;

export type JsonRpcRequestFor_EXPERIMENTALGenesisConfig = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALGenesisConfigSchema>;

export type JsonRpcRequestFor_EXPERIMENTALLightClientBlockProof = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALLightClientBlockProofSchema>;

export type JsonRpcRequestFor_EXPERIMENTALLightClientProof = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALLightClientProofSchema>;

export type JsonRpcRequestFor_EXPERIMENTALMaintenanceWindows = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALMaintenanceWindowsSchema>;

export type JsonRpcRequestFor_EXPERIMENTALProtocolConfig = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALProtocolConfigSchema>;

export type JsonRpcRequestFor_EXPERIMENTALReceipt = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALReceiptSchema>;

export type JsonRpcRequestFor_EXPERIMENTALSplitStorageInfo = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALSplitStorageInfoSchema>;

export type JsonRpcRequestFor_EXPERIMENTALTxStatus = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALTxStatusSchema>;

export type JsonRpcRequestFor_EXPERIMENTALValidatorsOrdered = z.infer<typeof schemas.JsonRpcRequestFor_EXPERIMENTALValidatorsOrderedSchema>;

export type JsonRpcRequestForBlock = z.infer<typeof schemas.JsonRpcRequestForBlockSchema>;

export type JsonRpcRequestForBroadcastTxAsync = z.infer<typeof schemas.JsonRpcRequestForBroadcastTxAsyncSchema>;

export type JsonRpcRequestForBroadcastTxCommit = z.infer<typeof schemas.JsonRpcRequestForBroadcastTxCommitSchema>;

export type JsonRpcRequestForChanges = z.infer<typeof schemas.JsonRpcRequestForChangesSchema>;

export type JsonRpcRequestForChunk = z.infer<typeof schemas.JsonRpcRequestForChunkSchema>;

export type JsonRpcRequestForClientConfig = z.infer<typeof schemas.JsonRpcRequestForClientConfigSchema>;

export type JsonRpcRequestForGasPrice = z.infer<typeof schemas.JsonRpcRequestForGasPriceSchema>;

export type JsonRpcRequestForHealth = z.infer<typeof schemas.JsonRpcRequestForHealthSchema>;

export type JsonRpcRequestForLightClientProof = z.infer<typeof schemas.JsonRpcRequestForLightClientProofSchema>;

export type JsonRpcRequestForNetworkInfo = z.infer<typeof schemas.JsonRpcRequestForNetworkInfoSchema>;

export type JsonRpcRequestForNextLightClientBlock = z.infer<typeof schemas.JsonRpcRequestForNextLightClientBlockSchema>;

export type JsonRpcRequestForQuery = z.infer<typeof schemas.JsonRpcRequestForQuerySchema>;

export type JsonRpcRequestForSendTx = z.infer<typeof schemas.JsonRpcRequestForSendTxSchema>;

export type JsonRpcRequestForStatus = z.infer<typeof schemas.JsonRpcRequestForStatusSchema>;

export type JsonRpcRequestForTx = z.infer<typeof schemas.JsonRpcRequestForTxSchema>;

export type JsonRpcRequestForValidators = z.infer<typeof schemas.JsonRpcRequestForValidatorsSchema>;

export type JsonRpcResponseFor_ArrayOf_RangeOfUint64And_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_ArrayOf_RangeOfUint64And_RpcErrorSchema>;

export type JsonRpcResponseFor_ArrayOf_ValidatorStakeViewAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_ArrayOf_ValidatorStakeViewAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_CryptoHashAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_CryptoHashAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_GenesisConfigAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_GenesisConfigAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_Nullable_RpcHealthResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_Nullable_RpcHealthResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcBlockResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcBlockResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcChunkResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcChunkResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcClientConfigResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcClientConfigResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcCongestionLevelResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcCongestionLevelResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcGasPriceResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcGasPriceResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcLightClientBlockProofResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcLightClientBlockProofResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcLightClientExecutionProofResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcLightClientExecutionProofResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcLightClientNextBlockResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcLightClientNextBlockResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcNetworkInfoResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcNetworkInfoResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcProtocolConfigResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcProtocolConfigResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcQueryResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcQueryResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcReceiptResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcReceiptResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcSplitStorageInfoResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcSplitStorageInfoResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcStateChangesInBlockByTypeResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcStateChangesInBlockByTypeResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcStateChangesInBlockResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcStateChangesInBlockResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcStatusResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcStatusResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcTransactionResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcTransactionResponseAnd_RpcErrorSchema>;

export type JsonRpcResponseFor_RpcValidatorResponseAnd_RpcError = z.infer<typeof schemas.JsonRpcResponseFor_RpcValidatorResponseAnd_RpcErrorSchema>;

/**
 * Information about a Producer: its account name, peer_id and a list of
 * connected peers that the node can use to send message for this producer.
 */
export type KnownProducerView = z.infer<typeof schemas.KnownProducerViewSchema>;

export type LightClientBlockLiteView = z.infer<typeof schemas.LightClientBlockLiteViewSchema>;

/**
 * Describes limits for VM and Runtime. TODO #4139: consider switching to
 * strongly-typed wrappers instead of raw quantities
 */
export type LimitConfig = z.infer<typeof schemas.LimitConfigSchema>;

export type LogSummaryStyle = z.infer<typeof schemas.LogSummaryStyleSchema>;

export type MerklePathItem = z.infer<typeof schemas.MerklePathItemSchema>;

export type MethodResolveError = z.infer<typeof schemas.MethodResolveErrorSchema>;

export type MissingTrieValue = z.infer<typeof schemas.MissingTrieValueSchema>;

/** Contexts in which `StorageError::MissingTrieValue` error might occur. */
export type MissingTrieValueContext = z.infer<typeof schemas.MissingTrieValueContextSchema>;

export type MutableConfigValue = z.infer<typeof schemas.MutableConfigValueSchema>;

export type NetworkInfoView = z.infer<typeof schemas.NetworkInfoViewSchema>;

export type NextEpochValidatorInfo = z.infer<typeof schemas.NextEpochValidatorInfoSchema>;

/**
 * This is Action which mustn't contain DelegateAction. This struct is needed
 * to avoid the recursion when Action/DelegateAction is deserialized.
 * Important: Don't make the inner Action public, this must only be
 * constructed through the correct interface that ensures the inner Action is
 * actually not a delegate action. That would break an assumption of this
 * type, which we use in several places. For example, borsh de-/serialization
 * relies on it. If the invariant is broken, we may end up with a
 * `Transaction` or `Receipt` that we can serialize but deserializing it back
 * causes a parsing error.
 */
export type NonDelegateAction = z.infer<typeof schemas.NonDelegateActionSchema>;

/** Peer id is the public key. */
export type PeerId = z.infer<typeof schemas.PeerIdSchema>;

export type PeerInfoView = z.infer<typeof schemas.PeerInfoViewSchema>;

/** Error that can occur while preparing or executing Wasm smart-contract. */
export type PrepareError = z.infer<typeof schemas.PrepareErrorSchema>;

export type PublicKey = z.infer<typeof schemas.PublicKeySchema>;

export type RangeOfUint64 = z.infer<typeof schemas.RangeOfUint64Schema>;

export type ReceiptEnumView = z.infer<typeof schemas.ReceiptEnumViewSchema>;

/** Describes the error for validating a receipt. */
export type ReceiptValidationError = z.infer<typeof schemas.ReceiptValidationErrorSchema>;

export type ReceiptView = z.infer<typeof schemas.ReceiptViewSchema>;

export type RpcBlockRequest = z.infer<typeof schemas.RpcBlockRequestSchema>;

export type RpcBlockResponse = z.infer<typeof schemas.RpcBlockResponseSchema>;

export type RpcChunkRequest = z.infer<typeof schemas.RpcChunkRequestSchema>;

export type RpcChunkResponse = z.infer<typeof schemas.RpcChunkResponseSchema>;

export type RpcClientConfigRequest = z.infer<typeof schemas.RpcClientConfigRequestSchema>;

/** ClientConfig where some fields can be updated at runtime. */
export type RpcClientConfigResponse = z.infer<typeof schemas.RpcClientConfigResponseSchema>;

export type RpcCongestionLevelRequest = z.infer<typeof schemas.RpcCongestionLevelRequestSchema>;

export type RpcCongestionLevelResponse = z.infer<typeof schemas.RpcCongestionLevelResponseSchema>;

/**
 * This struct may be returned from JSON RPC server in case of error It is
 * expected that this struct has impl From<_> all other RPC errors like
 * [RpcBlockError](crate::types::blocks::RpcBlockError)
 */
export type RpcError = z.infer<typeof schemas.RpcErrorSchema>;

export type RpcGasPriceRequest = z.infer<typeof schemas.RpcGasPriceRequestSchema>;

export type RpcGasPriceResponse = z.infer<typeof schemas.RpcGasPriceResponseSchema>;

export type RpcHealthRequest = z.infer<typeof schemas.RpcHealthRequestSchema>;

export type RpcHealthResponse = z.infer<typeof schemas.RpcHealthResponseSchema>;

export type RpcKnownProducer = z.infer<typeof schemas.RpcKnownProducerSchema>;

export type RpcLightClientBlockProofRequest = z.infer<typeof schemas.RpcLightClientBlockProofRequestSchema>;

export type RpcLightClientBlockProofResponse = z.infer<typeof schemas.RpcLightClientBlockProofResponseSchema>;

export type RpcLightClientExecutionProofRequest = z.infer<typeof schemas.RpcLightClientExecutionProofRequestSchema>;

export type RpcLightClientExecutionProofResponse = z.infer<typeof schemas.RpcLightClientExecutionProofResponseSchema>;

export type RpcLightClientNextBlockRequest = z.infer<typeof schemas.RpcLightClientNextBlockRequestSchema>;

/**
 * A state for the current head of a light client. More info
 * [here](https://nomicon.io/ChainSpec/LightClient).
 */
export type RpcLightClientNextBlockResponse = z.infer<typeof schemas.RpcLightClientNextBlockResponseSchema>;

export type RpcMaintenanceWindowsRequest = z.infer<typeof schemas.RpcMaintenanceWindowsRequestSchema>;

export type RpcNetworkInfoRequest = z.infer<typeof schemas.RpcNetworkInfoRequestSchema>;

export type RpcNetworkInfoResponse = z.infer<typeof schemas.RpcNetworkInfoResponseSchema>;

export type RpcPeerInfo = z.infer<typeof schemas.RpcPeerInfoSchema>;

export type RpcProtocolConfigRequest = z.infer<typeof schemas.RpcProtocolConfigRequestSchema>;

export type RpcProtocolConfigResponse = z.infer<typeof schemas.RpcProtocolConfigResponseSchema>;

export type RpcQueryRequest = z.infer<typeof schemas.RpcQueryRequestSchema>;

export type RpcQueryResponse = z.infer<typeof schemas.RpcQueryResponseSchema>;

export type RpcReceiptRequest = z.infer<typeof schemas.RpcReceiptRequestSchema>;

export type RpcReceiptResponse = z.infer<typeof schemas.RpcReceiptResponseSchema>;

export type RpcRequestValidationErrorKind = z.infer<typeof schemas.RpcRequestValidationErrorKindSchema>;

export type RpcSendTransactionRequest = z.infer<typeof schemas.RpcSendTransactionRequestSchema>;

export type RpcSplitStorageInfoRequest = z.infer<typeof schemas.RpcSplitStorageInfoRequestSchema>;

/** Contains the split storage information. */
export type RpcSplitStorageInfoResponse = z.infer<typeof schemas.RpcSplitStorageInfoResponseSchema>;

/**
 * It is a [serializable view] of [`StateChangesRequest`]. [serializable
 * view]: ./index.html [`StateChangesRequest`]:
 * ../types/struct.StateChangesRequest.html
 */
export type RpcStateChangesInBlockByTypeRequest = z.infer<typeof schemas.RpcStateChangesInBlockByTypeRequestSchema>;

export type RpcStateChangesInBlockByTypeResponse = z.infer<typeof schemas.RpcStateChangesInBlockByTypeResponseSchema>;

export type RpcStateChangesInBlockRequest = z.infer<typeof schemas.RpcStateChangesInBlockRequestSchema>;

export type RpcStateChangesInBlockResponse = z.infer<typeof schemas.RpcStateChangesInBlockResponseSchema>;

export type RpcStatusRequest = z.infer<typeof schemas.RpcStatusRequestSchema>;

export type RpcStatusResponse = z.infer<typeof schemas.RpcStatusResponseSchema>;

export type RpcTransactionResponse = z.infer<typeof schemas.RpcTransactionResponseSchema>;

export type RpcTransactionStatusRequest = z.infer<typeof schemas.RpcTransactionStatusRequestSchema>;

export type RpcValidatorRequest = z.infer<typeof schemas.RpcValidatorRequestSchema>;

/** Information about this epoch validators and next epoch validators */
export type RpcValidatorResponse = z.infer<typeof schemas.RpcValidatorResponseSchema>;

export type RpcValidatorsOrderedRequest = z.infer<typeof schemas.RpcValidatorsOrderedRequestSchema>;

/** View that preserves JSON format of the runtime config. */
export type RuntimeConfigView = z.infer<typeof schemas.RuntimeConfigViewSchema>;

/** Describes different fees for the runtime */
export type RuntimeFeesConfigView = z.infer<typeof schemas.RuntimeFeesConfigViewSchema>;

/**
 * The shard identifier. It may be an arbitrary number - it does not need to
 * be a number in the range 0..NUM_SHARDS. The shard ids do not need to be
 * sequential or contiguous. The shard id is wrapped in a new type to prevent
 * the old pattern of using indices in range 0..NUM_SHARDS and casting to
 * ShardId. Once the transition if fully complete it potentially may be
 * simplified to a regular type alias.
 */
export type ShardId = z.infer<typeof schemas.ShardIdSchema>;

/**
 * A versioned struct that contains all information needed to assign accounts
 * to shards. Because of re-sharding, the chain may use different shard layout
 * to split shards at different times. Currently, `ShardLayout` is stored as
 * part of `EpochConfig`, which is generated each epoch given the epoch
 * protocol version. In mainnet/testnet, we use two shard layouts since
 * re-sharding has only happened once. It is stored as part of genesis config,
 * see default_simple_nightshade_shard_layout() Below is an overview for some
 * important functionalities of ShardLayout interface.
 */
export type ShardLayout = z.infer<typeof schemas.ShardLayoutSchema>;

/**
 * A shard layout that maps accounts evenly across all shards -- by calculate
 * the hash of account id and mod number of shards. This is added to capture
 * the old `account_id_to_shard_id` algorithm, to keep backward compatibility
 * for some existing tests. `parent_shards` for `ShardLayoutV1` is always
 * `None`, meaning it can only be the first shard layout a chain uses.
 */
export type ShardLayoutV0 = z.infer<typeof schemas.ShardLayoutV0Schema>;

export type ShardLayoutV1 = z.infer<typeof schemas.ShardLayoutV1Schema>;

/**
 * Counterpart to `ShardLayoutV2` composed of maps with string keys to aid
 * serde serialization.
 */
export type ShardLayoutV2 = z.infer<typeof schemas.ShardLayoutV2Schema>;

/**
 * `ShardUId` is a unique representation for shards from different shard
 * layouts. Comparing to `ShardId`, which is just an ordinal number ranging
 * from 0 to NUM_SHARDS-1, `ShardUId` provides a way to unique identify shards
 * when shard layouts may change across epochs. This is important because we
 * store states indexed by shards in our database, so we need a way to unique
 * identify shard even when shards change across epochs. Another difference
 * between `ShardUId` and `ShardId` is that `ShardUId` should only exist in a
 * node's internal state while `ShardId` can be exposed to outside APIs and
 * used in protocol level information (for example, `ShardChunkHeader`
 * contains `ShardId` instead of `ShardUId`)
 */
export type ShardUId = z.infer<typeof schemas.ShardUIdSchema>;

export type Signature = z.infer<typeof schemas.SignatureSchema>;

export type SignedDelegateAction = z.infer<typeof schemas.SignedDelegateActionSchema>;

export type SignedTransaction = z.infer<typeof schemas.SignedTransactionSchema>;

export type SignedTransactionView = z.infer<typeof schemas.SignedTransactionViewSchema>;

export type SlashedValidator = z.infer<typeof schemas.SlashedValidatorSchema>;

/** An action which stakes signer_id tokens and setup's validator public key */
export type StakeAction = z.infer<typeof schemas.StakeActionSchema>;

/** See crate::types::StateChangeCause for details. */
export type StateChangeCauseView = z.infer<typeof schemas.StateChangeCauseViewSchema>;

/**
 * It is a [serializable view] of [`StateChangeKind`]. [serializable view]:
 * ./index.html [`StateChangeKind`]: ../types/struct.StateChangeKind.html
 */
export type StateChangeKindView = z.infer<typeof schemas.StateChangeKindViewSchema>;

export type StateChangeWithCauseView = z.infer<typeof schemas.StateChangeWithCauseViewSchema>;

/**
 * Item of the state, key and value are serialized in base64 and proof for
 * inclusion of given state item.
 */
export type StateItem = z.infer<typeof schemas.StateItemSchema>;

export type StateSyncConfig = z.infer<typeof schemas.StateSyncConfigSchema>;

export type StatusSyncInfo = z.infer<typeof schemas.StatusSyncInfoSchema>;

/**
 * Errors which may occur during working with trie storages, storing trie
 * values (trie nodes and state values) by their hashes.
 */
export type StorageError = z.infer<typeof schemas.StorageErrorSchema>;

/**
 * This enum represents if a storage_get call will be performed through flat
 * storage or trie
 */
export type StorageGetMode = z.infer<typeof schemas.StorageGetModeSchema>;

/** Describes cost of storage per block */
export type StorageUsageConfigView = z.infer<typeof schemas.StorageUsageConfigViewSchema>;

/**
 * This type is used to mark keys (arrays of bytes) that are queried from
 * store. NOTE: Currently, this type is only used in the view_client and RPC
 * to be able to transparently pretty-serialize the bytes arrays as
 * base64-encoded strings (see `serialize.rs`).
 */
export type StoreKey = z.infer<typeof schemas.StoreKeySchema>;

/**
 * This type is used to mark values returned from store (arrays of bytes).
 * NOTE: Currently, this type is only used in the view_client and RPC to be
 * able to transparently pretty-serialize the bytes arrays as base64-encoded
 * strings (see `serialize.rs`).
 */
export type StoreValue = z.infer<typeof schemas.StoreValueSchema>;

export type SyncCheckpoint = z.infer<typeof schemas.SyncCheckpointSchema>;

export type SyncConcurrency = z.infer<typeof schemas.SyncConcurrencySchema>;

/** Configures how to fetch state parts during state sync. */
export type SyncConfig = z.infer<typeof schemas.SyncConfigSchema>;

export type Tier1ProxyView = z.infer<typeof schemas.Tier1ProxyViewSchema>;

/**
 * Describes the expected behavior of the node regarding shard tracking. If
 * the node is an active validator, it will also track the shards it is
 * responsible for as a validator.
 */
export type TrackedShardsConfig = z.infer<typeof schemas.TrackedShardsConfigSchema>;

export type TransferAction = z.infer<typeof schemas.TransferActionSchema>;

/** Error returned in the ExecutionOutcome in case of failure */
export type TxExecutionError = z.infer<typeof schemas.TxExecutionErrorSchema>;

export type TxExecutionStatus = z.infer<typeof schemas.TxExecutionStatusSchema>;

/** Use global contract action */
export type UseGlobalContractAction = z.infer<typeof schemas.UseGlobalContractActionSchema>;

export type VMConfigView = z.infer<typeof schemas.VMConfigViewSchema>;

export type VMKind = z.infer<typeof schemas.VMKindSchema>;

export type ValidatorInfo = z.infer<typeof schemas.ValidatorInfoSchema>;

/** Reasons for removing a validator from the validator set. */
export type ValidatorKickoutReason = z.infer<typeof schemas.ValidatorKickoutReasonSchema>;

export type ValidatorKickoutView = z.infer<typeof schemas.ValidatorKickoutViewSchema>;

export type ValidatorStakeView = z.infer<typeof schemas.ValidatorStakeViewSchema>;

export type ValidatorStakeViewV1 = z.infer<typeof schemas.ValidatorStakeViewV1Schema>;

/** Data structure for semver version and github tag or commit. */
export type Version = z.infer<typeof schemas.VersionSchema>;

/** Resulting state values for a view state query request */
export type ViewStateResult = z.infer<typeof schemas.ViewStateResultSchema>;

/** A kind of a trap happened during execution of a binary */
export type WasmTrap = z.infer<typeof schemas.WasmTrapSchema>;

/** Configuration specific to ChunkStateWitness. */
export type WitnessConfigView = z.infer<typeof schemas.WitnessConfigViewSchema>;

// Method-specific types
export type EXPERIMENTALChangesRequest = z.infer<typeof schemas.EXPERIMENTALChangesRequestSchema>;

export type EXPERIMENTALChangesResponse = z.infer<typeof schemas.EXPERIMENTALChangesResponseSchema>;

export type EXPERIMENTALChangesInBlockRequest = z.infer<typeof schemas.EXPERIMENTALChangesInBlockRequestSchema>;

export type EXPERIMENTALChangesInBlockResponse = z.infer<typeof schemas.EXPERIMENTALChangesInBlockResponseSchema>;

export type EXPERIMENTALCongestionLevelRequest = z.infer<typeof schemas.EXPERIMENTALCongestionLevelRequestSchema>;

export type EXPERIMENTALCongestionLevelResponse = z.infer<typeof schemas.EXPERIMENTALCongestionLevelResponseSchema>;

export type EXPERIMENTALGenesisConfigRequest = z.infer<typeof schemas.EXPERIMENTALGenesisConfigRequestSchema>;

export type EXPERIMENTALGenesisConfigResponse = z.infer<typeof schemas.EXPERIMENTALGenesisConfigResponseSchema>;

export type EXPERIMENTALLightClientBlockProofRequest = z.infer<typeof schemas.EXPERIMENTALLightClientBlockProofRequestSchema>;

export type EXPERIMENTALLightClientBlockProofResponse = z.infer<typeof schemas.EXPERIMENTALLightClientBlockProofResponseSchema>;

export type EXPERIMENTALLightClientProofRequest = z.infer<typeof schemas.EXPERIMENTALLightClientProofRequestSchema>;

export type EXPERIMENTALLightClientProofResponse = z.infer<typeof schemas.EXPERIMENTALLightClientProofResponseSchema>;

export type EXPERIMENTALMaintenanceWindowsRequest = z.infer<typeof schemas.EXPERIMENTALMaintenanceWindowsRequestSchema>;

export type EXPERIMENTALMaintenanceWindowsResponse = z.infer<typeof schemas.EXPERIMENTALMaintenanceWindowsResponseSchema>;

export type EXPERIMENTALProtocolConfigRequest = z.infer<typeof schemas.EXPERIMENTALProtocolConfigRequestSchema>;

export type EXPERIMENTALProtocolConfigResponse = z.infer<typeof schemas.EXPERIMENTALProtocolConfigResponseSchema>;

export type EXPERIMENTALReceiptRequest = z.infer<typeof schemas.EXPERIMENTALReceiptRequestSchema>;

export type EXPERIMENTALReceiptResponse = z.infer<typeof schemas.EXPERIMENTALReceiptResponseSchema>;

export type EXPERIMENTALSplitStorageInfoRequest = z.infer<typeof schemas.EXPERIMENTALSplitStorageInfoRequestSchema>;

export type EXPERIMENTALSplitStorageInfoResponse = z.infer<typeof schemas.EXPERIMENTALSplitStorageInfoResponseSchema>;

export type EXPERIMENTALTxStatusRequest = z.infer<typeof schemas.EXPERIMENTALTxStatusRequestSchema>;

export type EXPERIMENTALTxStatusResponse = z.infer<typeof schemas.EXPERIMENTALTxStatusResponseSchema>;

export type EXPERIMENTALValidatorsOrderedRequest = z.infer<typeof schemas.EXPERIMENTALValidatorsOrderedRequestSchema>;

export type EXPERIMENTALValidatorsOrderedResponse = z.infer<typeof schemas.EXPERIMENTALValidatorsOrderedResponseSchema>;

export type BlockRequest = z.infer<typeof schemas.BlockRequestSchema>;

export type BlockResponse = z.infer<typeof schemas.BlockResponseSchema>;

export type BroadcastTxAsyncRequest = z.infer<typeof schemas.BroadcastTxAsyncRequestSchema>;

export type BroadcastTxAsyncResponse = z.infer<typeof schemas.BroadcastTxAsyncResponseSchema>;

export type BroadcastTxCommitRequest = z.infer<typeof schemas.BroadcastTxCommitRequestSchema>;

export type BroadcastTxCommitResponse = z.infer<typeof schemas.BroadcastTxCommitResponseSchema>;

export type ChangesRequest = z.infer<typeof schemas.ChangesRequestSchema>;

export type ChangesResponse = z.infer<typeof schemas.ChangesResponseSchema>;

export type ChunkRequest = z.infer<typeof schemas.ChunkRequestSchema>;

export type ChunkResponse = z.infer<typeof schemas.ChunkResponseSchema>;

export type ClientConfigRequest = z.infer<typeof schemas.ClientConfigRequestSchema>;

export type ClientConfigResponse = z.infer<typeof schemas.ClientConfigResponseSchema>;

export type GasPriceRequest = z.infer<typeof schemas.GasPriceRequestSchema>;

export type GasPriceResponse = z.infer<typeof schemas.GasPriceResponseSchema>;

export type HealthRequest = z.infer<typeof schemas.HealthRequestSchema>;

export type HealthResponse = z.infer<typeof schemas.HealthResponseSchema>;

export type LightClientProofRequest = z.infer<typeof schemas.LightClientProofRequestSchema>;

export type LightClientProofResponse = z.infer<typeof schemas.LightClientProofResponseSchema>;

export type NetworkInfoRequest = z.infer<typeof schemas.NetworkInfoRequestSchema>;

export type NetworkInfoResponse = z.infer<typeof schemas.NetworkInfoResponseSchema>;

export type NextLightClientBlockRequest = z.infer<typeof schemas.NextLightClientBlockRequestSchema>;

export type NextLightClientBlockResponse = z.infer<typeof schemas.NextLightClientBlockResponseSchema>;

export type QueryRequest = z.infer<typeof schemas.QueryRequestSchema>;

export type QueryResponse = z.infer<typeof schemas.QueryResponseSchema>;

export type SendTxRequest = z.infer<typeof schemas.SendTxRequestSchema>;

export type SendTxResponse = z.infer<typeof schemas.SendTxResponseSchema>;

export type StatusRequest = z.infer<typeof schemas.StatusRequestSchema>;

export type StatusResponse = z.infer<typeof schemas.StatusResponseSchema>;

export type TxRequest = z.infer<typeof schemas.TxRequestSchema>;

export type TxResponse = z.infer<typeof schemas.TxResponseSchema>;

export type ValidatorsRequest = z.infer<typeof schemas.ValidatorsRequestSchema>;

export type ValidatorsResponse = z.infer<typeof schemas.ValidatorsResponseSchema>;

// Re-exports for convenience
export * from './schemas';
