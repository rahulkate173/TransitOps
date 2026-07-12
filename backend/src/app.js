import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import vehicleRouter from './routes/vehicle.routes.js';
import driverRouter from './routes/driver.routes.js';
import tripRouter from './routes/trip.routes.js';
import maintainenceRouter from './routes/maintainence.routes.js';
import expenseRouter from './routes/expense.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,              
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/trips", tripRouter);
app.use("/api/maintenance", maintainenceRouter);
app.use("/api/expenses", expenseRouter);


export default app;