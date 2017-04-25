+++
abstract = "ShieldFS is an innovative solution to fight ransomware attacks. It automatically creates detection models that distinguish ransomware from benign processes at runtime on the base of the filesystem activity. ShieldFS adapts these models to the filesystem usage habits observed on the protected system. ShieldFS applies the detection approach in a real-time, self-healing virtual filesystem that shadows the write operations and reverts the effects of ransomware attacks safeguarding the integrity of users' data. Thus, if a file is modified by one or more malicious processes, the filesystem presents the original, mirrored copy to the user space applications. This shadowing mechanism is dynamically activated and deactivated depending on the outcome of the aforementioned detection logic. Additionally, ShieldFS looks for indicators of the use of cryptographic primitives. In particular, ShieldFS scans the memory of any process considered as potentially malicious, searching for traces of the typical block cipher key schedules."
authors = ["Andrea Continella", "Alessandro Guagnelli", "Giovanni Zingaro",
            "Giulio De Pasquale", "Alessandro Barenghi", "Stefano Zanero", "Federico Maggi"]
date = "2016-12-01"
image_preview = ""
math = true
publication_types = ["1"]
publication = "In *Proceedings of the Annual Computer Security Applications Conference (ACSAC)*"
publication_short = "In *ACSAC*"
selected = true
title = "ShieldFS: A Self-healing, Ransomware-aware Filesystem"
#url_code = "#"
#url_dataset = "#"
url_pdf = "http://shieldfs.necst.it/continella-shieldfs-2016.pdf"
#url_project = "project/deep-learning/"
url_slides = "http://shieldfs.necst.it/shieldfs-acsac16.pdf"
#url_video = "#"

#[[url_custom]]
#name = "Custom Link"
#url = "http://www.example.org"

# Optional featured image (relative to `static/img/` folder).
#[header]
#image = "headers/bubbles-wide.jpg"
#caption = "My caption :smile:"

+++
