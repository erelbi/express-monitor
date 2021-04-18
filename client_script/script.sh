#!/bin/bash
while true; do sleep 1 
hostname=$(hostname)
ip=$(hostname -I | awk '{print $1}')
cpu=$(top -b -n1 | grep "Cpu(s)" | awk '{print $2 + $4}') 
total_ram=$(free -m |  grep Mem  | awk '{print $2}')
usage_ram=$(free -m |  grep Mem  | awk '{print $3}')
curl -d '{"hostname": "'$hostname'","ip":"'$ip'","cpu":"'$cpu'","tram":"'$total_ram'","uram":"'$usage_ram'"}' -H "Content-Type: application/json" http://127.0.0.1:3000/ > /dev/null 2>&1 &
done
