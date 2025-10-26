// function wrapAsyc
module.exports=(fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next)// if any error acure that go to the catch and that call to the next
    }
}
