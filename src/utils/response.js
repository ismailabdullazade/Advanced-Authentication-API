class Response {
    constructor(data=null,message=null,){
        this.data=data
        this.message=message
    }

    success(res){
        return res.status(200).json({
            success:true,
            data:this.data,
            message:this.message ?? "Process is successful"
        })
    }

    created(res){
        return res.status(201).json({
            success:true,
            data:this.data,
            message:this.message ?? "Process is successful1"
        })
    }

    error500(res){
        return res.status(500).json({
            success:false,
            data:this.data,
            message:this.message ?? "Process is failed !"
        })
    }
    error400(res){
        return res.status(400).json({
            success:false,
            data:this.data,
            message:this.message ?? "Process is failed !"
        })
    }

    error401(res){
        return res.status(401).json({
            success:false,
            data:this.data,
            message:this.message ?? "Please open an account"
        })
    }

    error404(res){
        return res.status(404).json({
            success:false,
            data:this.data,
            message:this.message ?? "Unknown error"
        })
    }

    error429(res){
        return res.status(429).json({
            success:false,
            data:this.data,
            message:this.message ?? "Too much requests"
        })
    }
}

module.exports = Response;