# Express-Monitor

Linux istemcilerin anlık ram ve cpu kullanımını gösteren bir uygulama

## Veriler Nasıl iletiliyor?

Bir küçük post isteği ile

```bash
#!/bin/bash
while true; do sleep 1 
hostname=$(hostname)
ip=$(hostname -I | awk '{print $1}')
cpu=$(top -b -n1 | grep "Cpu(s)" | awk '{print $2 + $4}') 
total_ram=$(free -m |  grep Mem  | awk '{print $2}')
usage_ram=$(free -m |  grep Mem  | awk '{print $3}')
curl -d '{"hostname": "'$hostname'","ip":"'$ip'","cpu":"'$cpu'","tram":"'$total_ram'","uram":"'$usage_ram'"}' -H "Content-Type: application/json" http://127.0.0.1:3000/ > /dev/null 2>&1 &
done
```

## Cache İşlemi


Bu kısmı redis hallediyor. TTL'i iki saniye olacak şekilde ayarladık. Tabi bunun için bir ara katman gerekiyor...

```
router.post('/', (req, res) => {
    var clients_info =  [{"ip":req.body.ip,"cpu":req.body.cpu,"tram":req.body.tram,"uram":req.body.uram}]
    // console.log(clients_info)
    
    req.redis.setex(req.body.hostname,2,JSON.stringify(clients_info));

    return res.json({success:'Client Online',status: 200})
});

```

## Ara Katman
```
/* redis middleware
*/
app.use(function(req,res,next){
  req.redis = redisclient;
  next();
})
/*end
*/

```
## Tablo için  DataTable

```
  <script>
 
         
            $(document).ready(function() {
            $('#hostname').DataTable( {
                "ajax": 'http://localhost:3000/all',
                method: "GET",
               
                 "columns": [
            { "data": "hostname",

             "mRender": function ( data, type, full ) {
                     return '<a href="' + window.location+ data +'">'+data+'</a>';
                   }
                   
            }, 
            ]  
            });
            
                 } );
    </script>

```
### Kurulum ve Çalıştırma

* Bir küçük Redis Kurulumu

* Bir adet bash script

* Ve bu repo


```npm start ```



## License
[MIT](https://choosealicense.com/licenses/mit/)
