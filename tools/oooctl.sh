#!/bin/sh
#
# OpenOffice.org server-mode start
#
# (C) Copyright 2007 Nuxeo SAS (http://nuxeo.com/) and contributors.
#
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the GNU Lesser General Public License
# (LGPL) version 2.1 which accompanies this distribution, and is available at
# http://www.gnu.org/licenses/lgpl.html
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# Lesser General Public License for more details.
#
# Contributors:
#     Florent Guillaume
#
# $Id$

PORT=2002
#HOST=127.0.0.1
HOST=10.89.100.127

if [ `id -u` = 0 ]; then
    echo "Cannot run as root" >&2
    exit 2
fi

for SOFFICE in \
    /usr/lib/openoffice.org/program/soffice \
    /usr/lib/openoffice/program/soffice \
    /opt/openoffice.org2.2/program/soffice \
    "/Applications/OpenOffice.org 2.2.app/Contents/MacOS/program/soffice" \
    "`which soffice`" \
    ; do
    if [ -x "$SOFFICE" ]; then
        break
    fi
    SOFFICE=
done
if [ -z "$SOFFICE" ]; then
    echo "soffice binary not found" >&2
    exit 2
fi
if [ -z "$DISPLAY" ]; then
    USEXVFB=1
else
    USEXVFB=0
fi
if [ $USEXVFB = 1 ]; then
    PATH="$PATH:/usr/X11R6/bin"
    if [ -z "`which Xvfb`" ]; then
	echo "Xvfb binary not found" >&2
	exit 2
    fi
    DISPLAY=:77 # Arbitrary unused display
fi

start() {
    echo "Starting OpenOffice.org server..."
    if [ $USEXVFB = 1 ]; then
	Xvfb $DISPLAY >/dev/null 2>&1 &
	sleep 1 # Give Xvfb time to start
    fi
    "$SOFFICE" -headless -nofirststartwizard -norestore -nocrashreport -nologo -display $DISPLAY -accept="socket,host=$HOST,port=$PORT;urp;StarOffice.ServiceManager" >/dev/null 2>&1 &
    echo "Done."
}

stop() {
    echo "Stopping OpenOffice.org server..."
    # Note: ps axw (BSD syntax) works on both linux and Mac OS X
    #OOPID=`ps axw | awk '/soffice\ -headless/ {print $1}'`
    OOPID=`ps ax | grep soffice | grep headless | grep display | grep "accept=socket" | grep -v awk | awk '{print $1}'`
    if [ -n "$OOPID" ]; then
        kill $OOPID
        sleep 1 # Wait for it to die and release its port
        echo "Done."
    else
        echo "Nothing to stop." >&2
    fi
    XVPID=`ps axw | awk "/Xvfb\ $DISPLAY/"' {print $1}'`
    echo "Xvfb PId=$XVPID"
    if [ -n "$XVPID" ]; then
        kill -9 $XVPID
    fi
}


case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        start
        ;;
    *)
        echo "usage: `basename $0` (start|stop|restart|help)"
        ;;
esac
