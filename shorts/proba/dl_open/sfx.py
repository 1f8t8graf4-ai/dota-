# Сухие звуки теста «Духless» (синтез, без музыки): python3 sfx.py <выход.wav> [rc]
# rc — версия с каруселью: два мягких свайпа, опенинг сдвинут на 59/30 с.
import sys,subprocess,numpy as np
SR=48000;rng=np.random.default_rng(7)
RC=len(sys.argv)>2 and sys.argv[2]=='rc';OFF=59/30 if RC else 0.0;DUR=OFF+3.0
L=np.zeros(int(SR*DUR)+SR);Rr=np.zeros_like(L)
def T(n):return np.arange(n)/SR
def bp(x,lo,hi):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);m=((f>=lo)&(f<=hi)).astype(float)
    k=max(1,int(len(m)*0.004));m=np.convolve(m,np.ones(k)/k,'same');return np.fft.irfft(X*m,len(x))
def sweep(x,f0,f1,bw):  # полоса, плывущая во времени (кусками)
    y=np.zeros_like(x);n=len(x);seg=1024
    for i in range(0,n,seg//2):
        j=min(n,i+seg);w=np.hanning(j-i);fc=f0+(f1-f0)*(i/n);y[i:j]+=bp(x[i:j]*w,fc/bw,fc*bw)
    return y
def ring(fs,ds,n,amps=None):
    t=T(n);y=np.zeros(n)
    for i,(f,d) in enumerate(zip(fs,ds)):y+=(amps[i] if amps else 1)*np.sin(2*np.pi*f*t+rng.random()*6)*np.exp(-t/d)
    return y
def put(t0,x,g=1.0,pan=0.0):
    i=int((t0+OFF)*SR);x=x*g;n=min(len(x),len(L)-i);L[i:i+n]+=x[:n]*(1-pan)*0.5**0.5*2**0.5/2*1.0;Rr[i:i+n]+=x[:n]*(1+pan)*0.5
def nz(n):return rng.standard_normal(n)
def click(f=1.0,heavy=0.0):  # металлический щелчок
    n=int(0.12*SR);t=T(n);y=bp(nz(n),2000*f,9000*f)*np.exp(-t/0.004)*0.9
    y+=ring([2300*f,3700*f,5100*f,7600*f,1450*f],[0.05,0.035,0.025,0.018,0.06],n,[0.35,0.3,0.22,0.15,0.25])
    y+=heavy*np.sin(2*np.pi*170*t)*np.exp(-t/0.022)*1.4;y[:24]*=np.linspace(0,1,24);return y
def step():  # каблук по твёрдому полу коридора
    n=int(0.35*SR);t=T(n);y=bp(nz(n),1800,6000)*np.exp(-t/0.006)*0.7+np.sin(2*np.pi*110*t)*np.exp(-t/0.03)*1.1+bp(nz(n),300,1200)*np.exp(-t/0.02)*0.5
    tail=bp(nz(n),400,3000)*np.exp(-t/0.09)*0.05;return y+np.roll(tail,int(0.012*SR))
def whoosh(d,f0,f1,peak=0.6,bw=1.8):
    n=int(d*SR);t=T(n)/d;e=np.where(t<peak,(t/peak)**2,np.exp(-(t-peak)/(1-peak)*4.5));return sweep(nz(n),f0,f1,bw)*e
# кадр 1: щелчок защёлки + переворот красного окошка
put(0.16,click(1.0,1.0),0.9,-0.05);put(0.178,click(1.55,0.2),0.35,0.05)
# кадр 2: короткий резкий вдох через трубку
n=int(0.25*SR);t=T(n)/0.25;e=np.clip(t/0.7,0,1)**1.6*np.where(t>0.9,np.clip((1-t)/0.1,0,1),1)
sn=sweep(nz(n),1300,4200,1.5)*e+np.sin(2*np.pi*np.cumsum(2600+900*t)/SR)*e*0.05
put(0.77,sn,0.75)
put(0.62,whoosh(0.16,500,1400,0.7),0.12,0.3)  # рука влетает
# кадр 3: дверь (защёлка + воздух) и два шага
put(1.075,click(0.42,1.2),0.75,-0.4);put(1.08,whoosh(0.16,180,800,0.35,2.2),0.35,-0.4)
put(1.35,step(),0.85,-0.1);put(1.62,step(),0.95,0.05)
put(1.75,whoosh(0.16,160,1100,0.8,2.0),0.5,0.4)  # плечо проходит мимо камеры
# кадр 4: удар света и свист камеры
put(1.90,whoosh(0.22,2500,6000,0.05,1.6),0.12)
put(2.37,whoosh(0.15,700,3200,0.75,1.7),0.75,0.35)
# кадр 5: шлепок папки + шорох листов
n=int(0.3*SR);t=T(n);sl=bp(nz(n),2500,12000)*np.exp(-t/0.0035)*1.2+bp(nz(n),400,3000)*np.exp(-t/0.018)*0.8+np.sin(2*np.pi*95*t)*np.exp(-t/0.04)*1.3
put(2.62,sl,1.0)
n=int(0.36*SR);t=T(n);g=np.zeros(n)
for k in range(140):
    i=int(rng.random()**1.4*n*0.95);m=int(SR*(0.003+rng.random()*0.012));seg=nz(m)*np.hanning(m)*(0.3+rng.random());g[i:i+m]+=seg[:max(0,min(m,n-i))]
put(2.625,bp(g,2200,9000)*np.exp(-t/0.22),0.45,0.15)
if RC:  # два мягких свайпа карусели
    for ts in (29/30-0.26,59/30-0.26):put(ts-OFF,whoosh(0.26,900,2600,0.5,1.9),0.18,-0.2)
y=np.stack([L,Rr],1)[:int(SR*DUR)];pk=np.abs(y).max();y=y/pk*10**(-1/20)
pcm=(y*32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','2','-i','-',sys.argv[1]],input=pcm,check=True)
print('ok',sys.argv[1],f'{DUR:.2f} с')
