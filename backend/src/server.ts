import app from './app';
import { ensureDatabaseInitialized } from './config/db-init';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await ensureDatabaseInitialized();
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

startServer();
