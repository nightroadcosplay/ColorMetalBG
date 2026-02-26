<?php
use Phalcon\Mvc\Controller;
use Phalcon\Db\Enum;

class LogTokenidFromSalesController extends Controller
{

public function check($tokenid){
    $arrWhereCondition=[];
    $arrWhereCondition["tokenid"]=$tokenid;
    $sql="select 1 as status from ".$this->dbSchema.".log_tokenid_from_sales p where tokenid=:tokenid";
    $status = $this->db->fetchOne($sql,Enum::FETCH_ASSOC,$arrWhereCondition);
    if($status){
        return false;
        }
    else{
        $sql="insert into ".$this->dbSchema.".log_tokenid_from_sales values(:tokenid)";
        $status = $this->db->fetchOne($sql,Enum::FETCH_ASSOC,$arrWhereCondition);
         return true;
        }
    }
}
