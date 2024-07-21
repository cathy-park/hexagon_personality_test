{\rtf1\ansi\ansicpg949\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.getElementById('personality-test').addEventListener('submit', function (event) \{\
    event.preventDefault();\
\
    const formData = new FormData(this);\
    const responses = \{\};\
\
    formData.forEach((value, key) => \{\
        responses[key] = value;\
    \});\
\
    fetch('/submit', \{\
        method: 'POST',\
        headers: \{\
            'Content-Type': 'application/json'\
        \},\
        body: JSON.stringify(responses)\
    \})\
    .then(response => response.json())\
    .then(data => \{\
        alert(`\uc0\u45817 \u49888 \u51032  \u49457 \u44201  \u50976 \u54805 \u51008 : $\{data.type\}\\n$\{data.message\}`);\
    \});\
\});\
}