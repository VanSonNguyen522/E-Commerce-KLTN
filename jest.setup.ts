// import '@testing-library/jest-dom';
// import * as util from 'util';

// // Giải quyết lỗi "TextEncoder is not defined"
// Object.defineProperty(global, 'TextEncoder', {
//   value: class TextEncoder {
//     encode(str: string) {
//       const encoder = new util.TextEncoder();
//       return encoder.encode(str);
//     }
//   }
// });

// Object.defineProperty(global, 'TextDecoder', {
//   value: class TextDecoder {
//     decode(arr: Uint8Array) {
//       const decoder = new util.TextDecoder();
//       return decoder.decode(arr);
//     }
//   }
// });

// // Mock matchMedia (cho các component sử dụng media queries)
// global.matchMedia = global.matchMedia || function () {
//   return {
//     matches: false,
//     media: '',
//     onchange: null,
//     addListener: () => {},
//     removeListener: () => {},
//     addEventListener: () => {},
//     removeEventListener: () => {},
//     dispatchEvent: () => false,
//   };
// };


import '@testing-library/jest-dom';
import { TextEncoder as UtilTextEncoder, TextDecoder as UtilTextDecoder } from 'util';

Object.defineProperty(global, 'TextEncoder', {
  value: class TextEncoder {
    encode(str: string) {
      const encoder = new UtilTextEncoder();
      return encoder.encode(str);
    }
  }
});

Object.defineProperty(global, 'TextDecoder', {
  value: class TextDecoder {
    decode(arr: Uint8Array) {
      const decoder = new UtilTextDecoder();
      return decoder.decode(arr);
    }
  }
});

global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};
