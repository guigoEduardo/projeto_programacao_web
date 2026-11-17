const service=require('./adminService');const {success}=require('../../middlewares/apiResponse');const {parseId}=require('../../utils/parseId');const {parsePagination}=require('../../utils/pagination');const {SEARCH}=require('../../config/constants');
function readSearch(value){return typeof value==='string'?value.trim().slice(0,SEARCH.MAX_LENGTH):'';}
exports.dashboard=async(req,res)=>success(res,await service.dashboard());
exports.reports=async(req,res)=>{const{page,limit}=parsePagination(req.query);return success(res,await service.reports(req.query.status||'pending',page,limit));};
exports.review=async(req,res)=>success(res,await service.reviewReport(parseId(req.params.id,'denúncia')),'Denúncia marcada como revisada.');
exports.users=async(req,res)=>{const{page,limit}=parsePagination(req.query);return success(res,await service.users(readSearch(req.query.search),page,limit));};
exports.block=async(req,res)=>{const user=await service.blockUser(parseId(req.params.id,'usuário'),req.body.isBlocked,req.user.id);return success(res,user,'Status do usuário atualizado.');};
exports.destinations=async(req,res)=>{const{page,limit}=parsePagination(req.query);return success(res,await service.destinations(readSearch(req.query.search),page,limit));};
exports.deleteDestination=async(req,res)=>{await service.deleteDestination(parseId(req.params.id,'destino'),req.user.id);return success(res,null,'Destino excluído com sucesso!');};
