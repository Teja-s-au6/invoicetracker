const { connect } = require('mongoose');
const { MONGODB_URI, MONGODB_PASSWORD } = process.env;
connect(MONGODB_URI.replace('<password>', MONGODB_PASSWORD), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})
	.then((_) => console.log('database connected'))
	.catch((err) => console.log(err.message));
