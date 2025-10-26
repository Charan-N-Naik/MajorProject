// class expressError extends Error{
//     constructor(status,message){
//       this.message=message;
//         this.status=status;
        
//     }
// }
class expressError extends Error {
  constructor(statusCode, message) {
    super(message); // ✅ must call super() before using 'this'
    this.statusCode = statusCode;
  }
}

module.exports = expressError;



