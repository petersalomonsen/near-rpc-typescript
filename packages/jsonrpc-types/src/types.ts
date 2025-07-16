// Auto-generated TypeScript types from NEAR OpenAPI spec
// Generated on: 2025-07-16T21:51:14.474Z
// Do not edit manually - run 'pnpm generate' to regenerate

/**
 * Access key provides limited access to an account. Each access key belongs
 * to some account and is identified by a unique (within the account) public
 * key. One account may have large number of access keys. Access keys allow to
 * act on behalf of the account by restricting transactions that can be
 * issued. `account_id,public_key` is a key in the state
 */
export interface AccessKey {
  nonce: number;
  permission: AccessKeyPermission;
}

/** Describes the cost of creating an access key. */
export interface AccessKeyCreationConfigView {
  fullAccessCost: Fee;
  functionCallCost: Fee;
  functionCallCostPerByte: Fee;
}

export interface AccessKeyInfoView {
  accessKey: AccessKeyView;
  publicKey: PublicKey;
}

export interface AccessKeyList {
  keys: AccessKeyInfoView[];
}

/** Defines permissions for AccessKey */
export type AccessKeyPermission =
  | {
      FunctionCall: FunctionCallPermission;
    }
  | 'FullAccess';

export type AccessKeyPermissionView =
  | 'FullAccess'
  | {
      FunctionCall: {
        allowance?: string;
        methodNames: string[];
        receiverId: string;
      };
    };

export interface AccessKeyView {
  nonce: number;
  permission: AccessKeyPermissionView;
}

/** The structure describes configuration for creation of new accounts. */
export interface AccountCreationConfigView {
  minAllowedTopLevelAccountLength: number;
  registrarAccountId: AccountId;
}

export interface AccountDataView {
  accountKey: PublicKey;
  peerId: PublicKey;
  proxies: Tier1ProxyView[];
  timestamp: string;
}

/**
 * NEAR Account Identifier. This is a unique, syntactically valid,
 * human-readable account identifier on the NEAR network. [See the crate-level
 * docs for information about validation.](index.html#account-id-rules) Also
 * see [Error kind precedence](AccountId#error-kind-precedence). ## Examples
 * ``` use near_account_id::AccountId; let alice: AccountId =
 * "alice.near".parse().unwrap();
 * assert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f) ```
 */
export type AccountId = string;

export type AccountIdValidityRulesVersion = number;

/** Account info for validators */
export interface AccountInfo {
  accountId: AccountId;
  amount: string;
  publicKey: PublicKey;
}

/** A view of the account */
export interface AccountView {
  amount: string;
  codeHash: CryptoHash;
  globalContractAccountId?: AccountId;
  globalContractHash?: CryptoHash;
  locked: string;
  storagePaidAt?: number;
  storageUsage: number;
}

export interface AccountWithPublicKey {
  accountId: AccountId;
  publicKey: PublicKey;
}

export type Action =
  | {
      CreateAccount: CreateAccountAction;
    }
  | {
      DeployContract: DeployContractAction;
    }
  | {
      FunctionCall: FunctionCallAction;
    }
  | {
      Transfer: TransferAction;
    }
  | {
      Stake: StakeAction;
    }
  | {
      AddKey: AddKeyAction;
    }
  | {
      DeleteKey: DeleteKeyAction;
    }
  | {
      DeleteAccount: DeleteAccountAction;
    }
  | {
      Delegate: SignedDelegateAction;
    }
  | {
      DeployGlobalContract: DeployGlobalContractAction;
    }
  | {
      UseGlobalContract: UseGlobalContractAction;
    };

/**
 * Describes the cost of creating a specific action, `Action`. Includes all
 * variants.
 */
export interface ActionCreationConfigView {
  addKeyCost: AccessKeyCreationConfigView;
  createAccountCost: Fee;
  delegateCost: Fee;
  deleteAccountCost: Fee;
  deleteKeyCost: Fee;
  deployContractCost: Fee;
  deployContractCostPerByte: Fee;
  functionCallCost: Fee;
  functionCallCostPerByte: Fee;
  stakeCost: Fee;
  transferCost: Fee;
}

/** An error happened during Action execution */
export interface ActionError {
  index?: number;
  kind: ActionErrorKind;
}

export type ActionErrorKind =
  | {
      AccountAlreadyExists: {
        accountId: AccountId;
      };
    }
  | {
      AccountDoesNotExist: {
        accountId: AccountId;
      };
    }
  | {
      CreateAccountOnlyByRegistrar: {
        accountId: AccountId;
        predecessorId: AccountId;
        registrarAccountId: AccountId;
      };
    }
  | {
      CreateAccountNotAllowed: {
        accountId: AccountId;
        predecessorId: AccountId;
      };
    }
  | {
      ActorNoPermission: {
        accountId: AccountId;
        actorId: AccountId;
      };
    }
  | {
      DeleteKeyDoesNotExist: {
        accountId: AccountId;
        publicKey: PublicKey;
      };
    }
  | {
      AddKeyAlreadyExists: {
        accountId: AccountId;
        publicKey: PublicKey;
      };
    }
  | {
      DeleteAccountStaking: {
        accountId: AccountId;
      };
    }
  | {
      LackBalanceForState: {
        accountId: AccountId;
        amount: string;
      };
    }
  | {
      TriesToUnstake: {
        accountId: AccountId;
      };
    }
  | {
      TriesToStake: {
        accountId: AccountId;
        balance: string;
        locked: string;
        stake: string;
      };
    }
  | {
      InsufficientStake: {
        accountId: AccountId;
        minimumStake: string;
        stake: string;
      };
    }
  | {
      FunctionCallError: FunctionCallError;
    }
  | {
      NewReceiptValidationError: ReceiptValidationError;
    }
  | {
      OnlyImplicitAccountCreationAllowed: {
        accountId: AccountId;
      };
    }
  | {
      DeleteAccountWithLargeState: {
        accountId: AccountId;
      };
    }
  | 'DelegateActionInvalidSignature'
  | {
      DelegateActionSenderDoesNotMatchTxReceiver: {
        receiverId: AccountId;
        senderId: AccountId;
      };
    }
  | 'DelegateActionExpired'
  | {
      DelegateActionAccessKeyError: InvalidAccessKeyError;
    }
  | {
      DelegateActionInvalidNonce: {
        akNonce: number;
        delegateNonce: number;
      };
    }
  | {
      DelegateActionNonceTooLarge: {
        delegateNonce: number;
        upperBound: number;
      };
    }
  | {
      GlobalContractDoesNotExist: {
        identifier: GlobalContractIdentifier;
      };
    };

export type ActionView =
  | 'CreateAccount'
  | {
      DeployContract: {
        code: string;
      };
    }
  | {
      FunctionCall: {
        args: string;
        deposit: string;
        gas: number;
        methodName: string;
      };
    }
  | {
      Transfer: {
        deposit: string;
      };
    }
  | {
      Stake: {
        publicKey: PublicKey;
        stake: string;
      };
    }
  | {
      AddKey: {
        accessKey: AccessKeyView;
        publicKey: PublicKey;
      };
    }
  | {
      DeleteKey: {
        publicKey: PublicKey;
      };
    }
  | {
      DeleteAccount: {
        beneficiaryId: AccountId;
      };
    }
  | {
      Delegate: {
        delegateAction: DelegateAction;
        signature: Signature;
      };
    }
  | {
      DeployGlobalContract: {
        code: string;
      };
    }
  | {
      DeployGlobalContractByAccountId: {
        code: string;
      };
    }
  | {
      UseGlobalContract: {
        codeHash: CryptoHash;
      };
    }
  | {
      UseGlobalContractByAccountId: {
        accountId: AccountId;
      };
    };

/** Describes the error for validating a list of actions. */
export type ActionsValidationError =
  | 'DeleteActionMustBeFinal'
  | {
      TotalPrepaidGasExceeded: {
        limit: number;
        totalPrepaidGas: number;
      };
    }
  | {
      TotalNumberOfActionsExceeded: {
        limit: number;
        totalNumberOfActions: number;
      };
    }
  | {
      AddKeyMethodNamesNumberOfBytesExceeded: {
        limit: number;
        totalNumberOfBytes: number;
      };
    }
  | {
      AddKeyMethodNameLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | 'IntegerOverflow'
  | {
      InvalidAccountId: {
        accountId: string;
      };
    }
  | {
      ContractSizeExceeded: {
        limit: number;
        size: number;
      };
    }
  | {
      FunctionCallMethodNameLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      FunctionCallArgumentsLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      UnsuitableStakingKey: {
        publicKey: PublicKey;
      };
    }
  | 'FunctionCallZeroAttachedGas'
  | 'DelegateActionMustBeOnlyOne'
  | {
      UnsupportedProtocolFeature: {
        protocolFeature: string;
        version: number;
      };
    };

export interface AddKeyAction {
  accessKey: AccessKey;
  publicKey: PublicKey;
}

/**
 * `BandwidthRequest` describes the size of receipts that a shard would like
 * to send to another shard. When a shard wants to send a lot of receipts to
 * another shard, it needs to create a request and wait for a bandwidth grant
 * from the bandwidth scheduler.
 */
export interface BandwidthRequest {
  requestedValuesBitmap: BandwidthRequestBitmap;
  toShard: number;
}

/**
 * Bitmap which describes which values from the predefined list are being
 * requested. The nth bit is set to 1 when the nth value from the list is
 * being requested.
 */
export interface BandwidthRequestBitmap {
  data: number[];
}

/**
 * A list of shard's bandwidth requests. Describes how much the shard would
 * like to send to other shards.
 */
export interface BandwidthRequests {
  V1: BandwidthRequestsV1;
}

export interface BandwidthRequestsV1 {
  requests: BandwidthRequest[];
}

export interface BlockHeaderInnerLiteView {
  blockMerkleRoot: CryptoHash;
  epochId: CryptoHash;
  height: number;
  nextBpHash: CryptoHash;
  nextEpochId: CryptoHash;
  outcomeRoot: CryptoHash;
  prevStateRoot: CryptoHash;
  timestamp: number;
  timestampNanosec: string;
}

export interface BlockHeaderView {
  approvals: Signature[];
  blockBodyHash?: CryptoHash;
  blockMerkleRoot: CryptoHash;
  blockOrdinal?: number;
  challengesResult: SlashedValidator[];
  challengesRoot: CryptoHash;
  chunkEndorsements?: number[][];
  chunkHeadersRoot: CryptoHash;
  chunkMask: boolean[];
  chunkReceiptsRoot: CryptoHash;
  chunkTxRoot: CryptoHash;
  chunksIncluded: number;
  epochId: CryptoHash;
  epochSyncDataHash?: CryptoHash;
  gasPrice: string;
  hash: CryptoHash;
  height: number;
  lastDsFinalBlock: CryptoHash;
  lastFinalBlock: CryptoHash;
  latestProtocolVersion: number;
  nextBpHash: CryptoHash;
  nextEpochId: CryptoHash;
  outcomeRoot: CryptoHash;
  prevHash: CryptoHash;
  prevHeight?: number;
  prevStateRoot: CryptoHash;
  randomValue: CryptoHash;
  rentPaid: string;
  signature: Signature;
  timestamp: number;
  timestampNanosec: string;
  totalSupply: string;
  validatorProposals: ValidatorStakeView[];
  validatorReward: string;
}

export type BlockId = number | CryptoHash;

export interface BlockStatusView {
  hash: CryptoHash;
  height: number;
}

export interface CallResult {
  logs: string[];
  result: number[];
}

export interface CatchupStatusView {
  blocksToCatchup: BlockStatusView[];
  shardSyncStatus: Record<string, string>;
  syncBlockHash: CryptoHash;
  syncBlockHeight: number;
}

/**
 * Config for the Chunk Distribution Network feature. This allows nodes to
 * push and pull chunks from a central stream. The two benefits of this
 * approach are: (1) less request/response traffic on the peer-to-peer network
 * and (2) lower latency for RPC nodes indexing the chain.
 */
export interface ChunkDistributionNetworkConfig {
  enabled: boolean;
  uris: ChunkDistributionUris;
}

/** URIs for the Chunk Distribution Network feature. */
export interface ChunkDistributionUris {
  get: string;
  set: string;
}

export interface ChunkHeaderView {
  balanceBurnt: string;
  bandwidthRequests?: BandwidthRequests;
  chunkHash: CryptoHash;
  congestionInfo?: CongestionInfoView;
  encodedLength: number;
  encodedMerkleRoot: CryptoHash;
  gasLimit: number;
  gasUsed: number;
  heightCreated: number;
  heightIncluded: number;
  outcomeRoot: CryptoHash;
  outgoingReceiptsRoot: CryptoHash;
  prevBlockHash: CryptoHash;
  prevStateRoot: CryptoHash;
  rentPaid: string;
  shardId: ShardId;
  signature: Signature;
  txRoot: CryptoHash;
  validatorProposals: ValidatorStakeView[];
  validatorReward: string;
}

export type CompilationError =
  | {
      CodeDoesNotExist: {
        accountId: AccountId;
      };
    }
  | {
      PrepareError: PrepareError;
    }
  | {
      WasmerCompileError: {
        msg: string;
      };
    };

export interface CongestionControlConfigView {
  allowedShardOutgoingGas: number;
  maxCongestionIncomingGas: number;
  maxCongestionMemoryConsumption: number;
  maxCongestionMissedChunks: number;
  maxCongestionOutgoingGas: number;
  maxOutgoingGas: number;
  maxTxGas: number;
  minOutgoingGas: number;
  minTxGas: number;
  outgoingReceiptsBigSizeLimit: number;
  outgoingReceiptsUsualSizeLimit: number;
  rejectTxCongestionThreshold: number;
}

export interface CongestionInfoView {
  allowedShard: number;
  bufferedReceiptsGas: string;
  delayedReceiptsGas: string;
  receiptBytes: number;
}

/** A view of the contract code. */
export interface ContractCodeView {
  codeBase64: string;
  hash: CryptoHash;
}

export interface CostGasUsed {
  cost: string;
  costCategory: string;
  gasUsed: string;
}

/** Create account action */
export type CreateAccountAction = Record<string, unknown>;

export type CryptoHash = string;

export interface CurrentEpochValidatorInfo {
  accountId: AccountId;
  isSlashed: boolean;
  numExpectedBlocks: number;
  numExpectedChunks?: number;
  numExpectedChunksPerShard?: number[];
  numExpectedEndorsements?: number;
  numExpectedEndorsementsPerShard?: number[];
  numProducedBlocks: number;
  numProducedChunks?: number;
  numProducedChunksPerShard?: number[];
  numProducedEndorsements?: number;
  numProducedEndorsementsPerShard?: number[];
  publicKey: PublicKey;
  shards: ShardId[];
  shardsEndorsed?: ShardId[];
  stake: string;
}

export interface DataReceiptCreationConfigView {
  baseCost: Fee;
  costPerByte: Fee;
}

export interface DataReceiverView {
  dataId: CryptoHash;
  receiverId: AccountId;
}

/** This action allows to execute the inner actions behalf of the defined sender. */
export interface DelegateAction {
  actions: NonDelegateAction[];
  maxBlockHeight: number;
  nonce: number;
  publicKey: PublicKey;
  receiverId: AccountId;
  senderId: AccountId;
}

export interface DeleteAccountAction {
  beneficiaryId: AccountId;
}

export interface DeleteKeyAction {
  publicKey: PublicKey;
}

/** Deploy contract action */
export interface DeployContractAction {
  code: string;
}

/** Deploy global contract action */
export interface DeployGlobalContractAction {
  code: string;
  deployMode: GlobalContractDeployMode;
}

export interface DetailedDebugStatus {
  blockProductionDelayMillis: number;
  catchupStatus: CatchupStatusView[];
  currentHeadStatus: BlockStatusView;
  currentHeaderHeadStatus: BlockStatusView;
  networkInfo: NetworkInfoView;
  syncStatus: string;
}

export type Direction = 'Left' | 'Right';

/** Configures how to dump state to external storage. */
export interface DumpConfig {
  credentialsFile?: string;
  iterationDelay?: DurationAsStdSchemaProvider;
  location: ExternalStorageLocation;
  restartDumpForShards?: ShardId[];
}

export interface DurationAsStdSchemaProvider {
  nanos: number;
  secs: number;
}

/**
 * Epoch identifier -- wrapped hash, to make it easier to distinguish. EpochId
 * of epoch T is the hash of last block in T-2 EpochId of first two epochs is
 * 0
 */
export type EpochId = CryptoHash;

export interface EpochSyncConfig {
  disableEpochSyncForBootstrapping?: boolean;
  epochSyncHorizon: number;
  ignoreEpochSyncNetworkRequests?: boolean;
  timeoutForEpochSync: DurationAsStdSchemaProvider;
}

export interface ExecutionMetadataView {
  gasProfile?: CostGasUsed[];
  version: number;
}

export interface ExecutionOutcomeView {
  executorId: AccountId;
  gasBurnt: number;
  logs: string[];
  metadata?: ExecutionMetadataView;
  receiptIds: CryptoHash[];
  status: ExecutionStatusView;
  tokensBurnt: string;
}

export interface ExecutionOutcomeWithIdView {
  blockHash: CryptoHash;
  id: CryptoHash;
  outcome: ExecutionOutcomeView;
  proof: MerklePathItem[];
}

export type ExecutionStatusView =
  | 'Unknown'
  | {
      Failure: TxExecutionError;
    }
  | {
      SuccessValue: string;
    }
  | {
      SuccessReceiptId: CryptoHash;
    };

/**
 * Typed view of ExtCostsConfig to preserve JSON output field names in
 * protocol config RPC output.
 */
export interface ExtCostsConfigView {
  altBn128G1MultiexpBase: number;
  altBn128G1MultiexpElement: number;
  altBn128G1SumBase: number;
  altBn128G1SumElement: number;
  altBn128PairingCheckBase: number;
  altBn128PairingCheckElement: number;
  base: number;
  bls12381G1MultiexpBase: number;
  bls12381G1MultiexpElement: number;
  bls12381G2MultiexpBase: number;
  bls12381G2MultiexpElement: number;
  bls12381MapFp2ToG2Base: number;
  bls12381MapFp2ToG2Element: number;
  bls12381MapFpToG1Base: number;
  bls12381MapFpToG1Element: number;
  bls12381P1DecompressBase: number;
  bls12381P1DecompressElement: number;
  bls12381P1SumBase: number;
  bls12381P1SumElement: number;
  bls12381P2DecompressBase: number;
  bls12381P2DecompressElement: number;
  bls12381P2SumBase: number;
  bls12381P2SumElement: number;
  bls12381PairingBase: number;
  bls12381PairingElement: number;
  contractCompileBase: number;
  contractCompileBytes: number;
  contractLoadingBase: number;
  contractLoadingBytes: number;
  ecrecoverBase: number;
  ed25519VerifyBase: number;
  ed25519VerifyByte: number;
  keccak256Base: number;
  keccak256Byte: number;
  keccak512Base: number;
  keccak512Byte: number;
  logBase: number;
  logByte: number;
  promiseAndBase: number;
  promiseAndPerPromise: number;
  promiseReturn: number;
  readCachedTrieNode: number;
  readMemoryBase: number;
  readMemoryByte: number;
  readRegisterBase: number;
  readRegisterByte: number;
  ripemd160Base: number;
  ripemd160Block: number;
  sha256Base: number;
  sha256Byte: number;
  storageHasKeyBase: number;
  storageHasKeyByte: number;
  storageIterCreateFromByte: number;
  storageIterCreatePrefixBase: number;
  storageIterCreatePrefixByte: number;
  storageIterCreateRangeBase: number;
  storageIterCreateToByte: number;
  storageIterNextBase: number;
  storageIterNextKeyByte: number;
  storageIterNextValueByte: number;
  storageLargeReadOverheadBase: number;
  storageLargeReadOverheadByte: number;
  storageReadBase: number;
  storageReadKeyByte: number;
  storageReadValueByte: number;
  storageRemoveBase: number;
  storageRemoveKeyByte: number;
  storageRemoveRetValueByte: number;
  storageWriteBase: number;
  storageWriteEvictedByte: number;
  storageWriteKeyByte: number;
  storageWriteValueByte: number;
  touchingTrieNode: number;
  utf16DecodingBase: number;
  utf16DecodingByte: number;
  utf8DecodingBase: number;
  utf8DecodingByte: number;
  validatorStakeBase: number;
  validatorTotalStakeBase: number;
  writeMemoryBase: number;
  writeMemoryByte: number;
  writeRegisterBase: number;
  writeRegisterByte: number;
  yieldCreateBase: number;
  yieldCreateByte: number;
  yieldResumeBase: number;
  yieldResumeByte: number;
}

export interface ExternalStorageConfig {
  externalStorageFallbackThreshold?: number;
  location: ExternalStorageLocation;
  numConcurrentRequests?: number;
  numConcurrentRequestsDuringCatchup?: number;
}

export type ExternalStorageLocation =
  | {
      S3: {
        bucket: string;
        region: string;
      };
    }
  | {
      Filesystem: {
        rootDir: string;
      };
    }
  | {
      GCS: {
        bucket: string;
      };
    };

/**
 * Costs associated with an object that can only be sent over the network (and
 * executed by the receiver). NOTE: `send_sir` or `send_not_sir` fees are
 * usually burned when the item is being created. And `execution` fee is
 * burned when the item is being executed.
 */
export interface Fee {
  execution: number;
  sendNotSir: number;
  sendSir: number;
}

/**
 * Execution outcome of the transaction and all the subsequent receipts. Could
 * be not finalized yet
 */
export interface FinalExecutionOutcomeView {
  receiptsOutcome: ExecutionOutcomeWithIdView[];
  status: FinalExecutionStatus;
  transaction: SignedTransactionView;
  transactionOutcome: ExecutionOutcomeWithIdView;
}

/**
 * Final execution outcome of the transaction and all of subsequent the
 * receipts. Also includes the generated receipt.
 */
export interface FinalExecutionOutcomeWithReceiptView {
  receipts: ReceiptView[];
  receiptsOutcome: ExecutionOutcomeWithIdView[];
  status: FinalExecutionStatus;
  transaction: SignedTransactionView;
  transactionOutcome: ExecutionOutcomeWithIdView;
}

export type FinalExecutionStatus =
  | 'NotStarted'
  | 'Started'
  | {
      Failure: TxExecutionError;
    }
  | {
      SuccessValue: string;
    };

/** Different types of finality. */
export type Finality = 'optimistic' | 'near-final' | 'final';

export interface FunctionCallAction {
  args: string;
  deposit: string;
  gas: number;
  methodName: string;
}

/**
 * Serializable version of `near-vm-runner::FunctionCallError`. Must never
 * reorder/remove elements, can only add new variants at the end (but do that
 * very carefully). It describes stable serialization format, and only used by
 * serialization logic.
 */
export type FunctionCallError =
  | 'WasmUnknownError'
  | '_EVMError'
  | {
      CompilationError: CompilationError;
    }
  | {
      LinkError: {
        msg: string;
      };
    }
  | {
      MethodResolveError: MethodResolveError;
    }
  | {
      WasmTrap: WasmTrap;
    }
  | {
      HostError: HostError;
    }
  | {
      ExecutionError: string;
    };

/**
 * Grants limited permission to make transactions with FunctionCallActions The
 * permission can limit the allowed balance to be spent on the prepaid gas. It
 * also restrict the account ID of the receiver for this function call. It
 * also can restrict the method name for the allowed function calls.
 */
export interface FunctionCallPermission {
  allowance?: string;
  methodNames: string[];
  receiverId: string;
}

/** Configuration for garbage collection. */
export interface GCConfig {
  gcBlocksLimit?: number;
  gcForkCleanStep?: number;
  gcNumEpochsToKeep?: number;
  gcStepPeriod?: DurationAsStdSchemaProvider;
}

export interface GasKeyView {
  balance: number;
  numNonces: number;
  permission: AccessKeyPermissionView;
}

export interface GenesisConfig {
  avgHiddenValidatorSeatsPerShard: number[];
  blockProducerKickoutThreshold: number;
  chainId: string;
  chunkProducerAssignmentChangesLimit?: number;
  chunkProducerKickoutThreshold: number;
  chunkValidatorOnlyKickoutThreshold?: number;
  dynamicResharding: boolean;
  epochLength: number;
  fishermenThreshold: string;
  gasLimit: number;
  gasPriceAdjustmentRate: number[];
  genesisHeight: number;
  genesisTime: string;
  maxGasPrice: string;
  maxInflationRate: number[];
  maxKickoutStakePerc?: number;
  minGasPrice: string;
  minimumStakeDivisor?: number;
  minimumStakeRatio?: number[];
  minimumValidatorsPerShard?: number;
  numBlockProducerSeats: number;
  numBlockProducerSeatsPerShard: number[];
  numBlocksPerYear: number;
  numChunkOnlyProducerSeats?: number;
  numChunkProducerSeats?: number;
  numChunkValidatorSeats?: number;
  onlineMaxThreshold?: number[];
  onlineMinThreshold?: number[];
  protocolRewardRate: number[];
  protocolTreasuryAccount: AccountId;
  protocolUpgradeStakeThreshold?: number[];
  protocolVersion: number;
  shardLayout?: ShardLayout;
  shuffleShardAssignmentForChunkProducers?: boolean;
  targetValidatorMandatesPerShard?: number;
  totalSupply: string;
  transactionValidityPeriod: number;
  useProductionConfig?: boolean;
  validators: AccountInfo[];
}

export type GenesisConfigRequest = Record<string, unknown>;

export type GlobalContractDeployMode = 'CodeHash' | 'AccountId';

export type GlobalContractIdentifier =
  | {
      CodeHash: CryptoHash;
    }
  | {
      AccountId: AccountId;
    };

export type HostError =
  | 'BadUTF16'
  | 'BadUTF8'
  | 'GasExceeded'
  | 'GasLimitExceeded'
  | 'BalanceExceeded'
  | 'EmptyMethodName'
  | {
      GuestPanic: {
        panicMsg: string;
      };
    }
  | 'IntegerOverflow'
  | {
      InvalidPromiseIndex: {
        promiseIdx: number;
      };
    }
  | 'CannotAppendActionToJointPromise'
  | 'CannotReturnJointPromise'
  | {
      InvalidPromiseResultIndex: {
        resultIdx: number;
      };
    }
  | {
      InvalidRegisterId: {
        registerId: number;
      };
    }
  | {
      IteratorWasInvalidated: {
        iteratorIndex: number;
      };
    }
  | 'MemoryAccessViolation'
  | {
      InvalidReceiptIndex: {
        receiptIndex: number;
      };
    }
  | {
      InvalidIteratorIndex: {
        iteratorIndex: number;
      };
    }
  | 'InvalidAccountId'
  | 'InvalidMethodName'
  | 'InvalidPublicKey'
  | {
      ProhibitedInView: {
        methodName: string;
      };
    }
  | {
      NumberOfLogsExceeded: {
        limit: number;
      };
    }
  | {
      KeyLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      ValueLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      TotalLogLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      NumberPromisesExceeded: {
        limit: number;
        numberOfPromises: number;
      };
    }
  | {
      NumberInputDataDependenciesExceeded: {
        limit: number;
        numberOfInputDataDependencies: number;
      };
    }
  | {
      ReturnedValueLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      ContractSizeExceeded: {
        limit: number;
        size: number;
      };
    }
  | {
      Deprecated: {
        methodName: string;
      };
    }
  | {
      ECRecoverError: {
        msg: string;
      };
    }
  | {
      AltBn128InvalidInput: {
        msg: string;
      };
    }
  | {
      Ed25519VerifyInvalidInput: {
        msg: string;
      };
    };

export type InvalidAccessKeyError =
  | {
      AccessKeyNotFound: {
        accountId: AccountId;
        publicKey: PublicKey;
      };
    }
  | {
      ReceiverMismatch: {
        akReceiver: string;
        txReceiver: AccountId;
      };
    }
  | {
      MethodNameMismatch: {
        methodName: string;
      };
    }
  | 'RequiresFullAccess'
  | {
      NotEnoughAllowance: {
        accountId: AccountId;
        allowance: string;
        cost: string;
        publicKey: PublicKey;
      };
    }
  | 'DepositWithFunctionCall';

/** An error happened during TX execution */
export type InvalidTxError =
  | {
      InvalidAccessKeyError: InvalidAccessKeyError;
    }
  | {
      InvalidSignerId: {
        signerId: string;
      };
    }
  | {
      SignerDoesNotExist: {
        signerId: AccountId;
      };
    }
  | {
      InvalidNonce: {
        akNonce: number;
        txNonce: number;
      };
    }
  | {
      NonceTooLarge: {
        txNonce: number;
        upperBound: number;
      };
    }
  | {
      InvalidReceiverId: {
        receiverId: string;
      };
    }
  | 'InvalidSignature'
  | {
      NotEnoughBalance: {
        balance: string;
        cost: string;
        signerId: AccountId;
      };
    }
  | {
      LackBalanceForState: {
        amount: string;
        signerId: AccountId;
      };
    }
  | 'CostOverflow'
  | 'InvalidChain'
  | 'Expired'
  | {
      ActionsValidation: ActionsValidationError;
    }
  | {
      TransactionSizeExceeded: {
        limit: number;
        size: number;
      };
    }
  | 'InvalidTransactionVersion'
  | {
      StorageError: StorageError;
    }
  | {
      ShardCongested: {
        congestionLevel: number;
        shardId: number;
      };
    }
  | {
      ShardStuck: {
        missedChunks: number;
        shardId: number;
      };
    };

export interface JsonRpcRequestFor_EXPERIMENTALChanges {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_changes';
  params: RpcStateChangesInBlockByTypeRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALChangesInBlock {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_changes_in_block';
  params: RpcStateChangesInBlockRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALCongestionLevel {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_congestion_level';
  params: RpcCongestionLevelRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALGenesisConfig {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_genesis_config';
  params: GenesisConfigRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALLightClientBlockProof {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_light_client_block_proof';
  params: RpcLightClientBlockProofRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALLightClientProof {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_light_client_proof';
  params: RpcLightClientExecutionProofRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALMaintenanceWindows {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_maintenance_windows';
  params: RpcMaintenanceWindowsRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALProtocolConfig {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_protocol_config';
  params: RpcProtocolConfigRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALReceipt {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_receipt';
  params: RpcReceiptRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALSplitStorageInfo {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_split_storage_info';
  params: RpcSplitStorageInfoRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALTxStatus {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_tx_status';
  params: RpcTransactionStatusRequest;
}

export interface JsonRpcRequestFor_EXPERIMENTALValidatorsOrdered {
  id: string;
  jsonrpc: string;
  method: 'EXPERIMENTAL_validators_ordered';
  params: RpcValidatorsOrderedRequest;
}

export interface JsonRpcRequestForBlock {
  id: string;
  jsonrpc: string;
  method: 'block';
  params: RpcBlockRequest;
}

export interface JsonRpcRequestForBroadcastTxAsync {
  id: string;
  jsonrpc: string;
  method: 'broadcast_tx_async';
  params: RpcSendTransactionRequest;
}

export interface JsonRpcRequestForBroadcastTxCommit {
  id: string;
  jsonrpc: string;
  method: 'broadcast_tx_commit';
  params: RpcSendTransactionRequest;
}

export interface JsonRpcRequestForChanges {
  id: string;
  jsonrpc: string;
  method: 'changes';
  params: RpcStateChangesInBlockByTypeRequest;
}

export interface JsonRpcRequestForChunk {
  id: string;
  jsonrpc: string;
  method: 'chunk';
  params: RpcChunkRequest;
}

export interface JsonRpcRequestForClientConfig {
  id: string;
  jsonrpc: string;
  method: 'client_config';
  params: RpcClientConfigRequest;
}

export interface JsonRpcRequestForGasPrice {
  id: string;
  jsonrpc: string;
  method: 'gas_price';
  params: RpcGasPriceRequest;
}

export interface JsonRpcRequestForHealth {
  id: string;
  jsonrpc: string;
  method: 'health';
  params: RpcHealthRequest;
}

export interface JsonRpcRequestForLightClientProof {
  id: string;
  jsonrpc: string;
  method: 'light_client_proof';
  params: RpcLightClientExecutionProofRequest;
}

export interface JsonRpcRequestForNetworkInfo {
  id: string;
  jsonrpc: string;
  method: 'network_info';
  params: RpcNetworkInfoRequest;
}

export interface JsonRpcRequestForNextLightClientBlock {
  id: string;
  jsonrpc: string;
  method: 'next_light_client_block';
  params: RpcLightClientNextBlockRequest;
}

export interface JsonRpcRequestForQuery {
  id: string;
  jsonrpc: string;
  method: 'query';
  params: RpcQueryRequest;
}

export interface JsonRpcRequestForSendTx {
  id: string;
  jsonrpc: string;
  method: 'send_tx';
  params: RpcSendTransactionRequest;
}

export interface JsonRpcRequestForStatus {
  id: string;
  jsonrpc: string;
  method: 'status';
  params: RpcStatusRequest;
}

export interface JsonRpcRequestForTx {
  id: string;
  jsonrpc: string;
  method: 'tx';
  params: RpcTransactionStatusRequest;
}

export interface JsonRpcRequestForValidators {
  id: string;
  jsonrpc: string;
  method: 'validators';
  params: RpcValidatorRequest;
}

export type JsonRpcResponseFor_ArrayOf_RangeOfUint64And_RpcError =
  | {
      result: RangeOfUint64[];
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_ArrayOf_ValidatorStakeViewAnd_RpcError =
  | {
      result: ValidatorStakeView[];
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_CryptoHashAnd_RpcError =
  | {
      result: CryptoHash;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_GenesisConfigAnd_RpcError =
  | {
      result: GenesisConfig;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_Nullable_RpcHealthResponseAnd_RpcError =
  | {
      result: RpcHealthResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcBlockResponseAnd_RpcError =
  | {
      result: RpcBlockResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcChunkResponseAnd_RpcError =
  | {
      result: RpcChunkResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcClientConfigResponseAnd_RpcError =
  | {
      result: RpcClientConfigResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcCongestionLevelResponseAnd_RpcError =
  | {
      result: RpcCongestionLevelResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcGasPriceResponseAnd_RpcError =
  | {
      result: RpcGasPriceResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcLightClientBlockProofResponseAnd_RpcError =
  | {
      result: RpcLightClientBlockProofResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcLightClientExecutionProofResponseAnd_RpcError =

    | {
        result: RpcLightClientExecutionProofResponse;
      }
    | {
        error: RpcError;
      };

export type JsonRpcResponseFor_RpcLightClientNextBlockResponseAnd_RpcError =
  | {
      result: RpcLightClientNextBlockResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcNetworkInfoResponseAnd_RpcError =
  | {
      result: RpcNetworkInfoResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcProtocolConfigResponseAnd_RpcError =
  | {
      result: RpcProtocolConfigResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcQueryResponseAnd_RpcError =
  | {
      result: RpcQueryResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcReceiptResponseAnd_RpcError =
  | {
      result: RpcReceiptResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcSplitStorageInfoResponseAnd_RpcError =
  | {
      result: RpcSplitStorageInfoResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcStateChangesInBlockByTypeResponseAnd_RpcError =

    | {
        result: RpcStateChangesInBlockByTypeResponse;
      }
    | {
        error: RpcError;
      };

export type JsonRpcResponseFor_RpcStateChangesInBlockResponseAnd_RpcError =
  | {
      result: RpcStateChangesInBlockResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcStatusResponseAnd_RpcError =
  | {
      result: RpcStatusResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcTransactionResponseAnd_RpcError =
  | {
      result: RpcTransactionResponse;
    }
  | {
      error: RpcError;
    };

export type JsonRpcResponseFor_RpcValidatorResponseAnd_RpcError =
  | {
      result: RpcValidatorResponse;
    }
  | {
      error: RpcError;
    };

/**
 * Information about a Producer: its account name, peer_id and a list of
 * connected peers that the node can use to send message for this producer.
 */
export interface KnownProducerView {
  accountId: AccountId;
  nextHops?: PublicKey[];
  peerId: PublicKey;
}

export interface LightClientBlockLiteView {
  innerLite: BlockHeaderInnerLiteView;
  innerRestHash: CryptoHash;
  prevBlockHash: CryptoHash;
}

/**
 * Describes limits for VM and Runtime. TODO #4139: consider switching to
 * strongly-typed wrappers instead of raw quantities
 */
export interface LimitConfig {
  accountIdValidityRulesVersion?: AccountIdValidityRulesVersion;
  initialMemoryPages: number;
  maxActionsPerReceipt: number;
  maxArgumentsLength: number;
  maxContractSize: number;
  maxFunctionsNumberPerContract?: number;
  maxGasBurnt: number;
  maxLengthMethodName: number;
  maxLengthReturnedData: number;
  maxLengthStorageKey: number;
  maxLengthStorageValue: number;
  maxLocalsPerContract?: number;
  maxMemoryPages: number;
  maxNumberBytesMethodNames: number;
  maxNumberInputDataDependencies: number;
  maxNumberLogs: number;
  maxNumberRegisters: number;
  maxPromisesPerFunctionCallAction: number;
  maxReceiptSize: number;
  maxRegisterSize: number;
  maxStackHeight: number;
  maxTotalLogLength: number;
  maxTotalPrepaidGas: number;
  maxTransactionSize: number;
  maxYieldPayloadSize: number;
  perReceiptStorageProofSizeLimit: number;
  registersMemoryLimit: number;
  yieldTimeoutLengthInBlocks: number;
}

export type LogSummaryStyle = 'plain' | 'colored';

export interface MerklePathItem {
  direction: Direction;
  hash: CryptoHash;
}

export type MethodResolveError =
  | 'MethodEmptyName'
  | 'MethodNotFound'
  | 'MethodInvalidSignature';

export interface MissingTrieValue {
  context: MissingTrieValueContext;
  hash: CryptoHash;
}

/** Contexts in which `StorageError::MissingTrieValue` error might occur. */
export type MissingTrieValueContext =
  | 'TrieIterator'
  | 'TriePrefetchingStorage'
  | 'TrieMemoryPartialStorage'
  | 'TrieStorage';

export type MutableConfigValue = string;

export interface NetworkInfoView {
  connectedPeers: PeerInfoView[];
  knownProducers: KnownProducerView[];
  numConnectedPeers: number;
  peerMaxCount: number;
  tier1AccountsData: AccountDataView[];
  tier1AccountsKeys: PublicKey[];
  tier1Connections: PeerInfoView[];
}

export interface NextEpochValidatorInfo {
  accountId: AccountId;
  publicKey: PublicKey;
  shards: ShardId[];
  stake: string;
}

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
export type NonDelegateAction = Action;

/** Peer id is the public key. */
export type PeerId = PublicKey;

export interface PeerInfoView {
  accountId?: AccountId;
  addr: string;
  archival: boolean;
  blockHash?: CryptoHash;
  connectionEstablishedTimeMillis: number;
  height?: number;
  isHighestBlockInvalid: boolean;
  isOutboundPeer: boolean;
  lastTimePeerRequestedMillis: number;
  lastTimeReceivedMessageMillis: number;
  nonce: number;
  peerId: PublicKey;
  receivedBytesPerSec: number;
  sentBytesPerSec: number;
  trackedShards: ShardId[];
}

/** Error that can occur while preparing or executing Wasm smart-contract. */
export type PrepareError =
  | 'Serialization'
  | 'Deserialization'
  | 'InternalMemoryDeclared'
  | 'GasInstrumentation'
  | 'StackHeightInstrumentation'
  | 'Instantiate'
  | 'Memory'
  | 'TooManyFunctions'
  | 'TooManyLocals';

export type PublicKey = string;

export interface RangeOfUint64 {
  end: number;
  start: number;
}

export type ReceiptEnumView =
  | {
      Action: {
        actions: ActionView[];
        gasPrice: string;
        inputDataIds: CryptoHash[];
        isPromiseYield?: boolean;
        outputDataReceivers: DataReceiverView[];
        signerId: AccountId;
        signerPublicKey: PublicKey;
      };
    }
  | {
      Data: {
        data?: string;
        dataId: CryptoHash;
        isPromiseResume?: boolean;
      };
    }
  | {
      GlobalContractDistribution: {
        alreadyDeliveredShards: ShardId[];
        code: string;
        id: GlobalContractIdentifier;
        targetShard: ShardId;
      };
    };

/** Describes the error for validating a receipt. */
export type ReceiptValidationError =
  | {
      InvalidPredecessorId: {
        accountId: string;
      };
    }
  | {
      InvalidReceiverId: {
        accountId: string;
      };
    }
  | {
      InvalidSignerId: {
        accountId: string;
      };
    }
  | {
      InvalidDataReceiverId: {
        accountId: string;
      };
    }
  | {
      ReturnedValueLengthExceeded: {
        length: number;
        limit: number;
      };
    }
  | {
      NumberInputDataDependenciesExceeded: {
        limit: number;
        numberOfInputDataDependencies: number;
      };
    }
  | {
      ActionsValidation: ActionsValidationError;
    }
  | {
      ReceiptSizeExceeded: {
        limit: number;
        size: number;
      };
    };

export interface ReceiptView {
  predecessorId: AccountId;
  priority?: number;
  receipt: ReceiptEnumView;
  receiptId: CryptoHash;
  receiverId: AccountId;
}

export type RpcBlockRequest =
  | {
      blockId: BlockId;
    }
  | {
      finality: Finality;
    }
  | {
      syncCheckpoint: SyncCheckpoint;
    };

export interface RpcBlockResponse {
  author: AccountId;
  chunks: ChunkHeaderView[];
  header: BlockHeaderView;
}

export type RpcChunkRequest =
  | {
      blockId: BlockId;
      shardId: ShardId;
    }
  | {
      chunkId: CryptoHash;
    };

export interface RpcChunkResponse {
  author: AccountId;
  header: ChunkHeaderView;
  receipts: ReceiptView[];
  transactions: SignedTransactionView[];
}

export type RpcClientConfigRequest = Record<string, unknown>;

/** ClientConfig where some fields can be updated at runtime. */
export interface RpcClientConfigResponse {
  archive: boolean;
  blockFetchHorizon: number;
  blockHeaderFetchHorizon: number;
  blockProductionTrackingDelay: number[];
  catchupStepPeriod: number[];
  chainId: string;
  chunkDistributionNetwork?: ChunkDistributionNetworkConfig;
  chunkRequestRetryPeriod: number[];
  chunkWaitMult: number[];
  clientBackgroundMigrationThreads: number;
  doomslugStepPeriod: number[];
  enableMultilineLogging: boolean;
  enableStatisticsExport: boolean;
  epochLength: number;
  epochSync: EpochSyncConfig;
  expectedShutdown: MutableConfigValue;
  gc: GCConfig;
  headerSyncExpectedHeightPerSecond: number;
  headerSyncInitialTimeout: number[];
  headerSyncProgressTimeout: number[];
  headerSyncStallBanTimeout: number[];
  logSummaryPeriod: number[];
  logSummaryStyle: LogSummaryStyle;
  maxBlockProductionDelay: number[];
  maxBlockWaitDelay: number[];
  maxGasBurntView?: number;
  minBlockProductionDelay: number[];
  minNumPeers: number;
  numBlockProducerSeats: number;
  orphanStateWitnessMaxSize: number;
  orphanStateWitnessPoolSize: number;
  produceChunkAddTransactionsTimeLimit: string;
  produceEmptyBlocks: boolean;
  reshardingConfig: MutableConfigValue;
  rpcAddr?: string;
  saveInvalidWitnesses: boolean;
  saveLatestWitnesses: boolean;
  saveTrieChanges: boolean;
  saveTxOutcomes: boolean;
  skipSyncWait: boolean;
  stateSync: StateSyncConfig;
  stateSyncEnabled: boolean;
  stateSyncExternalBackoff: number[];
  stateSyncExternalTimeout: number[];
  stateSyncP2pTimeout: number[];
  stateSyncRetryBackoff: number[];
  syncCheckPeriod: number[];
  syncHeightThreshold: number;
  syncMaxBlockRequests: number;
  syncStepPeriod: number[];
  trackedShardsConfig: TrackedShardsConfig;
  transactionPoolSizeLimit?: number;
  transactionRequestHandlerThreads: number;
  trieViewerStateSizeLimit?: number;
  ttlAccountIdRouter: number[];
  txRoutingHeightHorizon: number;
  version: Version;
  viewClientThreads: number;
  viewClientThrottlePeriod: number[];
}

export type RpcCongestionLevelRequest =
  | {
      blockId: BlockId;
      shardId: ShardId;
    }
  | {
      chunkId: CryptoHash;
    };

export interface RpcCongestionLevelResponse {
  congestionLevel: number;
}

/**
 * This struct may be returned from JSON RPC server in case of error It is
 * expected that this struct has impl From<_> all other RPC errors like
 * [RpcBlockError](crate::types::blocks::RpcBlockError)
 */
export type RpcError =
  | {
      cause: RpcRequestValidationErrorKind;
      name: 'REQUEST_VALIDATION_ERROR';
    }
  | {
      cause: unknown;
      name: 'HANDLER_ERROR';
    }
  | {
      cause: unknown;
      name: 'INTERNAL_ERROR';
    };

export interface RpcGasPriceRequest {
  blockId?: BlockId;
}

export interface RpcGasPriceResponse {
  gasPrice: string;
}

export type RpcHealthRequest = Record<string, unknown>;

export type RpcHealthResponse = Record<string, unknown>;

export interface RpcKnownProducer {
  accountId: AccountId;
  addr?: string;
  peerId: PeerId;
}

export interface RpcLightClientBlockProofRequest {
  blockHash: CryptoHash;
  lightClientHead: CryptoHash;
}

export interface RpcLightClientBlockProofResponse {
  blockHeaderLite: LightClientBlockLiteView;
  blockProof: MerklePathItem[];
}

export type RpcLightClientExecutionProofRequest =
  | {
      senderId: AccountId;
      transactionHash: CryptoHash;
      type: 'transaction';
    }
  | {
      receiptId: CryptoHash;
      receiverId: AccountId;
      type: 'receipt';
    };

export interface RpcLightClientExecutionProofResponse {
  blockHeaderLite: LightClientBlockLiteView;
  blockProof: MerklePathItem[];
  outcomeProof: ExecutionOutcomeWithIdView;
  outcomeRootProof: MerklePathItem[];
}

export interface RpcLightClientNextBlockRequest {
  lastBlockHash: CryptoHash;
}

export interface RpcLightClientNextBlockResponse {
  approvalsAfterNext?: Signature[];
  innerLite?: BlockHeaderInnerLiteView;
  innerRestHash?: CryptoHash;
  nextBlockInnerHash?: CryptoHash;
  nextBps?: ValidatorStakeView[];
  prevBlockHash?: CryptoHash;
}

export interface RpcMaintenanceWindowsRequest {
  accountId: AccountId;
}

export type RpcNetworkInfoRequest = Record<string, unknown>;

export interface RpcNetworkInfoResponse {
  activePeers: RpcPeerInfo[];
  knownProducers: RpcKnownProducer[];
  numActivePeers: number;
  peerMaxCount: number;
  receivedBytesPerSec: number;
  sentBytesPerSec: number;
}

export interface RpcPeerInfo {
  accountId?: AccountId;
  addr?: string;
  id: PeerId;
}

export type RpcProtocolConfigRequest =
  | {
      blockId: BlockId;
    }
  | {
      finality: Finality;
    }
  | {
      syncCheckpoint: SyncCheckpoint;
    };

export interface RpcProtocolConfigResponse {
  avgHiddenValidatorSeatsPerShard: number[];
  blockProducerKickoutThreshold: number;
  chainId: string;
  chunkProducerKickoutThreshold: number;
  chunkValidatorOnlyKickoutThreshold: number;
  dynamicResharding: boolean;
  epochLength: number;
  fishermenThreshold: string;
  gasLimit: number;
  gasPriceAdjustmentRate: number[];
  genesisHeight: number;
  genesisTime: string;
  maxGasPrice: string;
  maxInflationRate: number[];
  maxKickoutStakePerc: number;
  minGasPrice: string;
  minimumStakeDivisor: number;
  minimumStakeRatio: number[];
  minimumValidatorsPerShard: number;
  numBlockProducerSeats: number;
  numBlockProducerSeatsPerShard: number[];
  numBlocksPerYear: number;
  onlineMaxThreshold: number[];
  onlineMinThreshold: number[];
  protocolRewardRate: number[];
  protocolTreasuryAccount: AccountId;
  protocolUpgradeStakeThreshold: number[];
  protocolVersion: number;
  runtimeConfig: RuntimeConfigView;
  shardLayout: ShardLayout;
  shuffleShardAssignmentForChunkProducers: boolean;
  targetValidatorMandatesPerShard: number;
  transactionValidityPeriod: number;
}

export type RpcQueryRequest =
  | {
      blockId: BlockId;
    }
  | {
      finality: Finality;
    }
  | ({
      syncCheckpoint: SyncCheckpoint;
    } & {
      accountId: AccountId;
      requestType: 'view_account';
    })
  | {
      accountId: AccountId;
      requestType: 'view_code';
    }
  | {
      accountId: AccountId;
      includeProof?: boolean;
      prefixBase64: string;
      requestType: 'view_state';
    }
  | {
      accountId: AccountId;
      publicKey: PublicKey;
      requestType: 'view_access_key';
    }
  | {
      accountId: AccountId;
      requestType: 'view_access_key_list';
    }
  | {
      accountId: AccountId;
      argsBase64: string;
      methodName: string;
      requestType: 'call_function';
    }
  | {
      codeHash: CryptoHash;
      requestType: 'view_global_contract_code';
    }
  | {
      accountId: AccountId;
      requestType: 'view_global_contract_code_by_account_id';
    };

export type RpcQueryResponse =
  | AccountView
  | ContractCodeView
  | ViewStateResult
  | CallResult
  | AccessKeyView
  | AccessKeyList;

export interface RpcReceiptRequest {
  receiptId: CryptoHash;
}

export interface RpcReceiptResponse {
  predecessorId: AccountId;
  priority?: number;
  receipt: ReceiptEnumView;
  receiptId: CryptoHash;
  receiverId: AccountId;
}

export type RpcRequestValidationErrorKind =
  | {
      info: {
        methodName: string;
      };
      name: 'METHOD_NOT_FOUND';
    }
  | {
      info: {
        errorMessage: string;
      };
      name: 'PARSE_ERROR';
    };

export interface RpcSendTransactionRequest {
  signedTxBase64: SignedTransaction;
  waitUntil?: TxExecutionStatus;
}

export type RpcSplitStorageInfoRequest = Record<string, unknown>;

/** Contains the split storage information. */
export interface RpcSplitStorageInfoResponse {
  coldHeadHeight?: number;
  finalHeadHeight?: number;
  headHeight?: number;
  hotDbKind?: string;
}

/**
 * It is a [serializable view] of [`StateChangesRequest`]. [serializable
 * view]: ./index.html [`StateChangesRequest`]:
 * ../types/struct.StateChangesRequest.html
 */
export type RpcStateChangesInBlockByTypeRequest =
  | {
      blockId: BlockId;
    }
  | {
      finality: Finality;
    }
  | ({
      syncCheckpoint: SyncCheckpoint;
    } & {
      accountIds: AccountId[];
      changesType: 'account_changes';
    })
  | {
      changesType: 'single_access_key_changes';
      keys: AccountWithPublicKey[];
    }
  | {
      changesType: 'single_gas_key_changes';
      keys: AccountWithPublicKey[];
    }
  | {
      accountIds: AccountId[];
      changesType: 'all_access_key_changes';
    }
  | {
      accountIds: AccountId[];
      changesType: 'all_gas_key_changes';
    }
  | {
      accountIds: AccountId[];
      changesType: 'contract_code_changes';
    }
  | {
      accountIds: AccountId[];
      changesType: 'data_changes';
      keyPrefixBase64: string;
    };

export interface RpcStateChangesInBlockByTypeResponse {
  blockHash: CryptoHash;
  changes: StateChangeKindView[];
}

export type RpcStateChangesInBlockRequest =
  | {
      blockId: BlockId;
    }
  | {
      finality: Finality;
    }
  | {
      syncCheckpoint: SyncCheckpoint;
    };

export interface RpcStateChangesInBlockResponse {
  blockHash: CryptoHash;
  changes: StateChangeWithCauseView[];
}

export type RpcStatusRequest = Record<string, unknown>;

export interface RpcStatusResponse {
  chainId: string;
  detailedDebugStatus?: DetailedDebugStatus;
  genesisHash: CryptoHash;
  latestProtocolVersion: number;
  nodeKey?: PublicKey;
  nodePublicKey: PublicKey;
  protocolVersion: number;
  rpcAddr?: string;
  syncInfo: StatusSyncInfo;
  uptimeSec: number;
  validatorAccountId?: AccountId;
  validatorPublicKey?: PublicKey;
  validators: ValidatorInfo[];
  version: Version;
}

export type RpcTransactionResponse =
  | FinalExecutionOutcomeWithReceiptView
  | FinalExecutionOutcomeView;

export type RpcTransactionStatusRequest =
  | {
      signedTxBase64: SignedTransaction;
    }
  | {
      senderAccountId: AccountId;
      txHash: CryptoHash;
    };

export type RpcValidatorRequest =
  | 'latest'
  | {
      epochId: EpochId;
    }
  | {
      blockId: BlockId;
    };

/** Information about this epoch validators and next epoch validators */
export interface RpcValidatorResponse {
  currentFishermen: ValidatorStakeView[];
  currentProposals: ValidatorStakeView[];
  currentValidators: CurrentEpochValidatorInfo[];
  epochHeight: number;
  epochStartHeight: number;
  nextFishermen: ValidatorStakeView[];
  nextValidators: NextEpochValidatorInfo[];
  prevEpochKickout: ValidatorKickoutView[];
}

export interface RpcValidatorsOrderedRequest {
  blockId?: BlockId;
}

/** View that preserves JSON format of the runtime config. */
export interface RuntimeConfigView {
  accountCreationConfig: AccountCreationConfigView;
  congestionControlConfig: CongestionControlConfigView;
  storageAmountPerByte: string;
  transactionCosts: RuntimeFeesConfigView;
  wasmConfig: VMConfigView;
  witnessConfig: WitnessConfigView;
}

export interface RuntimeFeesConfigView {
  actionCreationConfig: ActionCreationConfigView;
  actionReceiptCreationConfig: Fee;
  burntGasReward: number[];
  dataReceiptCreationConfig: DataReceiptCreationConfigView;
  pessimisticGasPriceInflationRatio: number[];
  storageUsageConfig: StorageUsageConfigView;
}

/**
 * The shard identifier. It may be an arbitrary number - it does not need to
 * be a number in the range 0..NUM_SHARDS. The shard ids do not need to be
 * sequential or contiguous. The shard id is wrapped in a new type to prevent
 * the old pattern of using indices in range 0..NUM_SHARDS and casting to
 * ShardId. Once the transition if fully complete it potentially may be
 * simplified to a regular type alias.
 */
export type ShardId = number;

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
export type ShardLayout =
  | {
      V0: ShardLayoutV0;
    }
  | {
      V1: ShardLayoutV1;
    }
  | {
      V2: ShardLayoutV2;
    };

/**
 * A shard layout that maps accounts evenly across all shards -- by calculate
 * the hash of account id and mod number of shards. This is added to capture
 * the old `account_id_to_shard_id` algorithm, to keep backward compatibility
 * for some existing tests. `parent_shards` for `ShardLayoutV1` is always
 * `None`, meaning it can only be the first shard layout a chain uses.
 */
export interface ShardLayoutV0 {
  numShards: number;
  version: number;
}

export interface ShardLayoutV1 {
  boundaryAccounts: AccountId[];
  shardsSplitMap?: ShardId[][];
  toParentShardMap?: ShardId[];
  version: number;
}

/**
 * Counterpart to `ShardLayoutV2` composed of maps with string keys to aid
 * serde serialization.
 */
export interface ShardLayoutV2 {
  boundaryAccounts: AccountId[];
  idToIndexMap: Record<string, number>;
  indexToIdMap: Record<string, ShardId>;
  shardIds: ShardId[];
  shardsParentMap?: Record<string, ShardId>;
  shardsSplitMap?: Record<string, ShardId[]>;
  version: number;
}

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
export interface ShardUId {
  shardId: number;
  version: number;
}

export type Signature = string;

export interface SignedDelegateAction {
  delegateAction: DelegateAction;
  signature: Signature;
}

export type SignedTransaction = string;

export interface SignedTransactionView {
  actions: ActionView[];
  hash: CryptoHash;
  nonce: number;
  priorityFee?: number;
  publicKey: PublicKey;
  receiverId: AccountId;
  signature: Signature;
  signerId: AccountId;
}

export interface SlashedValidator {
  accountId: AccountId;
  isDoubleSign: boolean;
}

/** An action which stakes signer_id tokens and setup's validator public key */
export interface StakeAction {
  publicKey: PublicKey;
  stake: string;
}

/** See crate::types::StateChangeCause for details. */
export type StateChangeCauseView =
  | {
      type: 'not_writable_to_disk';
    }
  | {
      type: 'initial_state';
    }
  | {
      txHash: CryptoHash;
      type: 'transaction_processing';
    }
  | {
      receiptHash: CryptoHash;
      type: 'action_receipt_processing_started';
    }
  | {
      receiptHash: CryptoHash;
      type: 'action_receipt_gas_reward';
    }
  | {
      receiptHash: CryptoHash;
      type: 'receipt_processing';
    }
  | {
      receiptHash: CryptoHash;
      type: 'postponed_receipt';
    }
  | {
      type: 'updated_delayed_receipts';
    }
  | {
      type: 'validator_accounts_update';
    }
  | {
      type: 'migration';
    }
  | {
      type: 'bandwidth_scheduler_state_update';
    };

/**
 * It is a [serializable view] of [`StateChangeKind`]. [serializable view]:
 * ./index.html [`StateChangeKind`]: ../types/struct.StateChangeKind.html
 */
export type StateChangeKindView =
  | {
      accountId: AccountId;
      type: 'account_touched';
    }
  | {
      accountId: AccountId;
      type: 'access_key_touched';
    }
  | {
      accountId: AccountId;
      type: 'data_touched';
    }
  | {
      accountId: AccountId;
      type: 'contract_code_touched';
    };

export type StateChangeWithCauseView =
  | {
      change: {
        accountId: AccountId;
        amount: string;
        codeHash: CryptoHash;
        globalContractAccountId?: AccountId;
        globalContractHash?: CryptoHash;
        locked: string;
        storagePaidAt?: number;
        storageUsage: number;
      };
      type: 'account_update';
    }
  | {
      change: {
        accountId: AccountId;
      };
      type: 'account_deletion';
    }
  | {
      change: {
        accessKey: AccessKeyView;
        accountId: AccountId;
        publicKey: PublicKey;
      };
      type: 'access_key_update';
    }
  | {
      change: {
        accountId: AccountId;
        publicKey: PublicKey;
      };
      type: 'access_key_deletion';
    }
  | {
      change: {
        accountId: AccountId;
        gasKey: GasKeyView;
        publicKey: PublicKey;
      };
      type: 'gas_key_update';
    }
  | {
      change: {
        accountId: AccountId;
        index: number;
        nonce: number;
        publicKey: PublicKey;
      };
      type: 'gas_key_nonce_update';
    }
  | {
      change: {
        accountId: AccountId;
        publicKey: PublicKey;
      };
      type: 'gas_key_deletion';
    }
  | {
      change: {
        accountId: AccountId;
        keyBase64: string;
        valueBase64: string;
      };
      type: 'data_update';
    }
  | {
      change: {
        accountId: AccountId;
        keyBase64: string;
      };
      type: 'data_deletion';
    }
  | {
      change: {
        accountId: AccountId;
        codeBase64: string;
      };
      type: 'contract_code_update';
    }
  | {
      change: {
        accountId: AccountId;
      };
      type: 'contract_code_deletion';
    };

/**
 * Item of the state, key and value are serialized in base64 and proof for
 * inclusion of given state item.
 */
export interface StateItem {
  key: string;
  value: string;
}

export interface StateSyncConfig {
  concurrency?: SyncConcurrency;
  dump?: DumpConfig;
  sync?: SyncConfig;
}

export interface StatusSyncInfo {
  earliestBlockHash?: CryptoHash;
  earliestBlockHeight?: number;
  earliestBlockTime?: string;
  epochId?: EpochId;
  epochStartHeight?: number;
  latestBlockHash: CryptoHash;
  latestBlockHeight: number;
  latestBlockTime: string;
  latestStateRoot: CryptoHash;
  syncing: boolean;
}

/**
 * Errors which may occur during working with trie storages, storing trie
 * values (trie nodes and state values) by their hashes.
 */
export type StorageError =
  | 'StorageInternalError'
  | {
      MissingTrieValue: MissingTrieValue;
    }
  | 'UnexpectedTrieValue'
  | {
      StorageInconsistentState: string;
    }
  | {
      FlatStorageBlockNotSupported: string;
    }
  | {
      MemTrieLoadingError: string;
    };

/**
 * This enum represents if a storage_get call will be performed through flat
 * storage or trie
 */
export type StorageGetMode = 'FlatStorage' | 'Trie';

/** Describes cost of storage per block */
export interface StorageUsageConfigView {
  numBytesAccount: number;
  numExtraBytesRecord: number;
}

export type SyncCheckpoint = 'genesis' | 'earliest_available';

export interface SyncConcurrency {
  apply: number;
  applyDuringCatchup: number;
  peerDownloads: number;
  perShard: number;
}

/** Configures how to fetch state parts during state sync. */
export type SyncConfig =
  | 'Peers'
  | {
      ExternalStorage: ExternalStorageConfig;
    };

export interface Tier1ProxyView {
  addr: string;
  peerId: PublicKey;
}

/**
 * Describes the expected behavior of the node regarding shard tracking. If
 * the node is an active validator, it will also track the shards it is
 * responsible for as a validator.
 */
export type TrackedShardsConfig =
  | 'NoShards'
  | {
      Shards: ShardUId[];
    }
  | 'AllShards'
  | {
      ShadowValidator: AccountId;
    }
  | {
      Schedule: ShardId[][];
    }
  | {
      Accounts: AccountId[];
    };

export interface TransferAction {
  deposit: string;
}

/** Error returned in the ExecutionOutcome in case of failure */
export type TxExecutionError =
  | {
      ActionError: ActionError;
    }
  | {
      InvalidTxError: InvalidTxError;
    };

export type TxExecutionStatus =
  | 'NONE'
  | 'INCLUDED'
  | 'EXECUTED_OPTIMISTIC'
  | 'INCLUDED_FINAL'
  | 'EXECUTED'
  | 'FINAL';

/** Use global contract action */
export interface UseGlobalContractAction {
  contractIdentifier: GlobalContractIdentifier;
}

export interface VMConfigView {
  discardCustomSections: boolean;
  ethImplicitAccounts: boolean;
  extCosts: ExtCostsConfigView;
  fixContractLoadingCost: boolean;
  globalContractHostFns: boolean;
  growMemCost: number;
  implicitAccountCreation: boolean;
  limitConfig: LimitConfig;
  reftypesBulkMemory: boolean;
  regularOpCost: number;
  saturatingFloatToInt: boolean;
  storageGetMode: StorageGetMode;
  vmKind: VMKind;
}

export type VMKind = 'Wasmer0' | 'Wasmtime' | 'Wasmer2' | 'NearVm' | 'NearVm2';

export interface ValidatorInfo {
  accountId: AccountId;
}

/** Reasons for removing a validator from the validator set. */
export type ValidatorKickoutReason =
  | '_UnusedSlashed'
  | {
      NotEnoughBlocks: {
        expected: number;
        produced: number;
      };
    }
  | {
      NotEnoughChunks: {
        expected: number;
        produced: number;
      };
    }
  | 'Unstaked'
  | {
      NotEnoughStake: {
        stakeU128: string;
        thresholdU128: string;
      };
    }
  | 'DidNotGetASeat'
  | {
      NotEnoughChunkEndorsements: {
        expected: number;
        produced: number;
      };
    }
  | {
      ProtocolVersionTooOld: {
        networkVersion: number;
        version: number;
      };
    };

export interface ValidatorKickoutView {
  accountId: AccountId;
  reason: ValidatorKickoutReason;
}

export type ValidatorStakeView = ValidatorStakeViewV1;

export interface ValidatorStakeViewV1 {
  accountId: AccountId;
  publicKey: PublicKey;
  stake: string;
}

/** Data structure for semver version and github tag or commit. */
export interface Version {
  build: string;
  commit: string;
  rustcVersion?: string;
  version: string;
}

export interface ViewStateResult {
  proof?: string[];
  values: StateItem[];
}

/** A kind of a trap happened during execution of a binary */
export type WasmTrap =
  | 'Unreachable'
  | 'IncorrectCallIndirectSignature'
  | 'MemoryOutOfBounds'
  | 'CallIndirectOOB'
  | 'IllegalArithmetic'
  | 'MisalignedAtomicAccess'
  | 'IndirectCallToNull'
  | 'StackOverflow'
  | 'GenericTrap';

/** Configuration specific to ChunkStateWitness. */
export interface WitnessConfigView {
  combinedTransactionsSizeLimit: number;
  mainStorageProofSizeSoftLimit: number;
  newTransactionsValidationStateSizeSoftLimit: number;
}

// Method-specific types
export type EXPERIMENTALChangesRequest = JsonRpcRequestFor_EXPERIMENTALChanges;

export type EXPERIMENTALChangesResponse =
  JsonRpcResponseFor_RpcStateChangesInBlockResponseAnd_RpcError;

export type EXPERIMENTALChangesInBlockRequest =
  JsonRpcRequestFor_EXPERIMENTALChangesInBlock;

export type EXPERIMENTALChangesInBlockResponse =
  JsonRpcResponseFor_RpcStateChangesInBlockByTypeResponseAnd_RpcError;

export type EXPERIMENTALCongestionLevelRequest =
  JsonRpcRequestFor_EXPERIMENTALCongestionLevel;

export type EXPERIMENTALCongestionLevelResponse =
  JsonRpcResponseFor_RpcCongestionLevelResponseAnd_RpcError;

export type EXPERIMENTALGenesisConfigRequest =
  JsonRpcRequestFor_EXPERIMENTALGenesisConfig;

export type EXPERIMENTALGenesisConfigResponse =
  JsonRpcResponseFor_GenesisConfigAnd_RpcError;

export type EXPERIMENTALLightClientBlockProofRequest =
  JsonRpcRequestFor_EXPERIMENTALLightClientBlockProof;

export type EXPERIMENTALLightClientBlockProofResponse =
  JsonRpcResponseFor_RpcLightClientBlockProofResponseAnd_RpcError;

export type EXPERIMENTALLightClientProofRequest =
  JsonRpcRequestFor_EXPERIMENTALLightClientProof;

export type EXPERIMENTALLightClientProofResponse =
  JsonRpcResponseFor_RpcLightClientExecutionProofResponseAnd_RpcError;

export type EXPERIMENTALMaintenanceWindowsRequest =
  JsonRpcRequestFor_EXPERIMENTALMaintenanceWindows;

export type EXPERIMENTALMaintenanceWindowsResponse =
  JsonRpcResponseFor_ArrayOf_RangeOfUint64And_RpcError;

export type EXPERIMENTALProtocolConfigRequest =
  JsonRpcRequestFor_EXPERIMENTALProtocolConfig;

export type EXPERIMENTALProtocolConfigResponse =
  JsonRpcResponseFor_RpcProtocolConfigResponseAnd_RpcError;

export type EXPERIMENTALReceiptRequest = JsonRpcRequestFor_EXPERIMENTALReceipt;

export type EXPERIMENTALReceiptResponse =
  JsonRpcResponseFor_RpcReceiptResponseAnd_RpcError;

export type EXPERIMENTALSplitStorageInfoRequest =
  JsonRpcRequestFor_EXPERIMENTALSplitStorageInfo;

export type EXPERIMENTALSplitStorageInfoResponse =
  JsonRpcResponseFor_RpcSplitStorageInfoResponseAnd_RpcError;

export type EXPERIMENTALTxStatusRequest =
  JsonRpcRequestFor_EXPERIMENTALTxStatus;

export type EXPERIMENTALTxStatusResponse =
  JsonRpcResponseFor_RpcTransactionResponseAnd_RpcError;

export type EXPERIMENTALValidatorsOrderedRequest =
  JsonRpcRequestFor_EXPERIMENTALValidatorsOrdered;

export type EXPERIMENTALValidatorsOrderedResponse =
  JsonRpcResponseFor_ArrayOf_ValidatorStakeViewAnd_RpcError;

export type BlockRequest = JsonRpcRequestForBlock;

export type BlockResponse = JsonRpcResponseFor_RpcBlockResponseAnd_RpcError;

export type BroadcastTxAsyncRequest = JsonRpcRequestForBroadcastTxAsync;

export type BroadcastTxAsyncResponse =
  JsonRpcResponseFor_CryptoHashAnd_RpcError;

export type BroadcastTxCommitRequest = JsonRpcRequestForBroadcastTxCommit;

export type BroadcastTxCommitResponse =
  JsonRpcResponseFor_RpcTransactionResponseAnd_RpcError;

export type ChunkRequest = JsonRpcRequestForChunk;

export type ChunkResponse = JsonRpcResponseFor_RpcChunkResponseAnd_RpcError;

export type ClientConfigRequest = JsonRpcRequestForClientConfig;

export type ClientConfigResponse =
  JsonRpcResponseFor_RpcClientConfigResponseAnd_RpcError;

export type GasPriceRequest = JsonRpcRequestForGasPrice;

export type GasPriceResponse =
  JsonRpcResponseFor_RpcGasPriceResponseAnd_RpcError;

export type HealthRequest = JsonRpcRequestForHealth;

export type HealthResponse =
  JsonRpcResponseFor_Nullable_RpcHealthResponseAnd_RpcError;

export type LightClientProofRequest = JsonRpcRequestForLightClientProof;

export type LightClientProofResponse =
  JsonRpcResponseFor_RpcLightClientExecutionProofResponseAnd_RpcError;

export type NetworkInfoRequest = JsonRpcRequestForNetworkInfo;

export type NetworkInfoResponse =
  JsonRpcResponseFor_RpcNetworkInfoResponseAnd_RpcError;

export type QueryRequest = JsonRpcRequestForQuery;

export type QueryResponse = JsonRpcResponseFor_RpcQueryResponseAnd_RpcError;

export type SendTxRequest = JsonRpcRequestForSendTx;

export type SendTxResponse =
  JsonRpcResponseFor_RpcTransactionResponseAnd_RpcError;

export type StatusRequest = JsonRpcRequestForStatus;

export type StatusResponse = JsonRpcResponseFor_RpcStatusResponseAnd_RpcError;

export type TxRequest = JsonRpcRequestForTx;

export type TxResponse = JsonRpcResponseFor_RpcTransactionResponseAnd_RpcError;

export type ValidatorsRequest = JsonRpcRequestForValidators;

export type ValidatorsResponse =
  JsonRpcResponseFor_RpcValidatorResponseAnd_RpcError;

// Re-exports for convenience
export * from './schemas';
