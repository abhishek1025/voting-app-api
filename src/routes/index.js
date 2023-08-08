import express from "express"
import userRouter from "./user.routes.js"
import votingEventRoutes from "./votingEvent.routes.js"

const apiRouter = express.Router()

apiRouter.use("/user", userRouter)
apiRouter.use("/event", votingEventRoutes)



export default apiRouter