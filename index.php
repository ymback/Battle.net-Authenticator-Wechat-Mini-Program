<?php
session_start();
class xiaochengxu
{
    protected $appId = "wx9869f83dd748e493";

    protected $secret = "0118ecc9232157dd22b77f07872cfb33";

    protected $grantType = "authorization_code";

    public function __construct()
    {

    }

    public function getSessionKey($code = '')
    {
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=%s";
        $newUrl = sprintf($url,$this->appId,$this->secret,$code,$this->grantType);
        $result = $this->getCurl($newUrl);
        $_SESSION[md5($result)] = $result;
        return $this->getAccount(md5($result));
    }

    public function getCurl($url)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $data = curl_exec($curl);
        curl_close($curl);
        return $data;
    }

    public function getAccount($md5)
    {
        /**
         * 做一些数据库操作...比如说查询关联账户...
         * 如果有关联账户返回,直接跳转安全令界面,没有关联账户返回0,
         * 跳转注册页面
         */
        return json_encode(['status'=>1,'msg'=>'','data'=>$md5]);
    }

    public function test()
    {
        return 1;
    }
}

$xiaochengxu = new xiaochengxu();
$tag = $_GET['tag'];
switch ($tag)
{
    case 'code':
        $code = $_GET['code'];
        echo $xiaochengxu->getSessionKey($code);
        break;
}