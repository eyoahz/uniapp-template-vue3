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

// Define an interface for encryption
// 定义一个加密器的接口
export interface Encryption {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}
export interface EncryptionParams {
  key: string;
  iv: string;
}

// Define an interface for Hashing
// 定义一个哈希算法的接口
export interface Hashing {
  hash(data: string): string;
}



// 对称加密
class AesEncryption implements Encryption {
	// readonly声明 => 只可以在构造函数中赋值一次，之后属性将变为不可修改
  private readonly key;
	// 防止相同的明文在相同密钥下生成相同的密文. iv不需要保密,但必须确保每次加密时都是唯一且不可预测的
  private readonly iv;

  constructor({ key, iv }: EncryptionParams) {
		// parse() => 用 crypto-js 进行加密和解密操作时，通常需要将字符串转换为 WordArray 格式
    this.key = parse(key);
    this.iv = parse(iv);
  }

  get getOptions() {
    return {
      mode: CTR,
      padding: pkcs7, // PKCS7 是一种常见的填充方式，确保块加密算法输入的长度符合块大小要求
      iv: this.iv,
    };
  }

  encrypt(plainText: string) {
    return aesEncrypt(plainText, this.key, this.getOptions).toString();
  }

  decrypt(cipherText: string) {
		// .toString(UTF8) => 执行解密操作时，得到的解密结果是一个 WordArray 对象，需要将其转换为可读的字符串形式（如 UTF-8 编码的文本）
    return aesDecrypt(cipherText, this.key, this.getOptions).toString(UTF8);
  }
}

/**
 * 单例模式
 * 1.当需要在整个应用程序中使用相同的配置设置时，单例模式可以确保配置管理器只有一个实例
 */

// Define a singleton class for Base64 encryption
// 为 Base64 加密定义一个单例类
// Base64Encryption.getInstance() => 获取单例实例
class Base64Encryption implements Encryption {
  private static instance: Base64Encryption;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): Base64Encryption {
    if (!Base64Encryption.instance) {
      Base64Encryption.instance = new Base64Encryption();
    }
    return Base64Encryption.instance;
  }

  encrypt(plainText: string) {
    return UTF8.parse(plainText).toString(Base64);
  }

  decrypt(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8);
  }
}

// Define a singleton class for MD5 Hashing
// 定义一个用于 MD5 哈希的单例类
// MD5Hashing.getInstance() => 获取单例实例
class MD5Hashing implements Hashing {
  private static instance: MD5Hashing;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): MD5Hashing {
    if (!MD5Hashing.instance) {
      MD5Hashing.instance = new MD5Hashing();
    }
    return MD5Hashing.instance;
  }

  hash(plainText: string) {
		// MD5() => 用于生成数据的唯一标识符，确保数据的一致性（非安全性的场景下使用）
    return MD5(plainText).toString();
  }
}

// Define a singleton class for SHA256 Hashing
// 定义一个用于 SHA256 哈希的单例类
// SHA256Hashing.getInstance() => 获取单例实例
class SHA256Hashing implements Hashing {
  private static instance: SHA256Hashing;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA256Hashing.instance) {
      SHA256Hashing.instance = new SHA256Hashing();
    }
    return SHA256Hashing.instance;
  }

  hash(plainText: string) {
		// SHA256() => 一种不可逆的加密哈希函数，它将任意长度的输入转换为固定长度（256位）的哈希值，广泛用于数据完整性验证和密码存储等场景
    return SHA256(plainText).toString();
  }
}

// Define a singleton class for SHA512 Hashing
// 定义一个用于 SHA512 哈希的单例类
// SHA512Hashing.getInstance() => 获取单例实例
class SHA512Hashing implements Hashing {
  private static instance: SHA512Hashing;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA512Hashing.instance) {
      SHA512Hashing.instance = new SHA512Hashing();
    }
    return SHA512Hashing.instance;
  }

  hash(plainText: string) {
		// SHA512() => 一种不可逆的加密哈希函数，它将任意长度的输入转换为固定长度（512位）的哈希值，用于数据完整性验证和密码存储等场景
		// 理论上更难破解
    return SHA512(plainText).toString();
  }
}

// Define a factory class for Encryption
// 定义一个加密工厂类
export class EncryptionFactory {
  public static createAesEncryption(params: EncryptionParams): Encryption {
    return new AesEncryption(params);
  }

  public static createBase64Encryption(): Encryption {
    return Base64Encryption.getInstance();
  }
}

// Define a factory class for Hashing
// 定义一个哈希工厂类
export class HashingFactory {
  public static createMD5Hashing(): Hashing {
    return MD5Hashing.getInstance();
  }

  public static createSHA256Hashing(): Hashing {
    return SHA256Hashing.getInstance();
  }

  public static createSHA512Hashing(): Hashing {
    return SHA512Hashing.getInstance();
  }
}
