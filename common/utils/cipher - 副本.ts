import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'crypto-js/aes';
import UTF8, { parse } from 'crypto-js/enc-utf8';
// PKCS7 是一种常见的填充方式，确保块加密算法输入的长度符合块大小要求
import pkcs7 from 'crypto-js/pad-pkcs7';
// 计数器模式（CTR）。这种模式适用于需要流加密的场景，同时允许并行化处理数据块
import CTR from 'crypto-js/mode-ctr';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

