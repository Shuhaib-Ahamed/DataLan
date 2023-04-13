import authRouter from "./auth/auth.routes.js";
import transactionRouter from "./transactions/transaction.routes.js";
import userRouter from "./user/user.routes.js";
import chainRouter from "./chain/chain.routes.js";
import assetRouter from "./asset/asset.routes.js";
import modelRouter from "./mlModels/models.routes.js";
import requestRouter from "./requests/requests.routes.js";
import authenticate from "../middlewares/authenticate.js";

export default (app) => {
  // Server Routes

  app.use("/api/v1/auth", authRouter);

  app.use("/api/v1/user", authenticate, userRouter);

  app.use("/api/v1/transactions", authenticate, transactionRouter);

  app.use("/api/v1/request", authenticate, requestRouter);

  app.use("/api/v1/chain", authenticate, chainRouter);

  app.use("/api/v1/assets", authenticate, assetRouter);
  
  app.use("/api/v1/models", authenticate, modelRouter);
};
