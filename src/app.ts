import * as express from 'express';
import router from './routes/blog'
import bodyParser = require('body-parser');



const app = express();
const port = 3003;

app.use(bodyParser.json());

app.use('/api/blog',router);

app.listen(port,()=>{
    console.log("blogging engine starting on port "+port);
});

