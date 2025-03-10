"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodedAddress = void 0;
const geocodedAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@TODO: use SDK instead of direct fetch request!
        const res = yield fetch(`${process.env.GEOCODER_ENDPOINT}?q=${address}&apikey=${process.env.GEOCODER_API_KEY}`);
        const data = yield res.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
});
exports.geocodedAddress = geocodedAddress;
// const options = {
//   provider: process.env.GEOCODER_ID,
//   httpAdapter: process.env.GEOCODER_API_KEY,
//   formatter: null,
// };
//# sourceMappingURL=geocoder.js.map