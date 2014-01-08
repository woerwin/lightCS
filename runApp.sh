#! /bin/sh 
 
NODE_ENV=production 
DAEMON="sumeru start"
#DAEMON="supervisor app.js" 
NAME=application 
DESC=application 
PIDFILE="application.pid" 
 
case "$1" in 
start)  
        echo "Starting $DESC: " 
        nohup $DAEMON > /dev/null & 
        echo $! > $PIDFILE 
        echo "$NAME." 
        ;; 
stop) 
        echo "Stopping $DESC: " 
        pid='cat $PIDFILE' 
        kill -9 $pid 
        killall node 
        rm $PIDFILE 
        echo "$NAME." 
        ;;
restart) 
        echo "Restarting $DESC: " 
        pid='cat $PIDFILE' 
        kill -9 $pid
        killall sumeru 
        rm $PIDFILE 
        nohup $DAEMON > /dev/null & 
        echo $! > $PIDFILE 
        echo "$NAME." 
        ;;      
esac 
 
exit 0