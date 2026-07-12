import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import vehicleRouter from './routes/vehicle.routes.js';
import driverRouter from './routes/driver.routes.js';
import tripRouter from './routes/trip.routes.js';
import maintainenceRouter from './routes/maintainence.routes.js';
import expenseRouter from './routes/expense.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import settingsRouter from './routes/settings.routes.js';
import cookieParser from 'cookie-parser';

const allowedOrigins = [
    'https://transit-ops-liart.vercel.app',
    'http://localhost:5173',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(null, false);
    },
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
app.use("/api/dashboard", dashboardRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/settings", settingsRouter);


export default app;