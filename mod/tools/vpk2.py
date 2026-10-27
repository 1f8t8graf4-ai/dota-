# VPK v1 (данные внутри _dir) -> VPK v2: тот же каталог и данные + блок контрольных сумм MD5, как у модов из CS2 Workshop Manager
import struct,sys,hashlib
b=open(sys.argv[1],'rb').read()
sig,ver,tree=struct.unpack_from('<III',b,0); assert sig==0x55aa1234 and ver==1
t=b[12:12+tree]; data=b[12+tree:]
h=struct.pack('<IIIIIII',0x55aa1234,2,tree,len(data),0,48,0)
body=h+t+data
md5=hashlib.md5(t).digest()+hashlib.md5(b'').digest()
md5+=hashlib.md5(body+md5).digest()
open(sys.argv[2],'wb').write(body+md5)
print('v2:',len(body+md5),'bytes, tree',tree,'data',len(data))
