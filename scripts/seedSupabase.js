"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function () { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
  var ownKeys = function (o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = __importStar(require("dotenv"));
var path_1 = __importDefault(require("path"));
var mockScholarships_1 = require("../src/data/mockScholarships");
dotenv.config({ path: path_1.default.resolve(__dirname, '../.env.local') });
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
function seed() {
  return __awaiter(this, void 0, void 0, function () {
    var _loop_1, _i, mockScholarships_2, s;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log("Seeding database via Supabase...");
          _loop_1 = function (s) {
            var _b, opp, oppErr, oppId, fieldInserts, reqInserts;
            return __generator(this, function (_c) {
              switch (_c.label) {
                case 0: return [4 /*yield*/, supabase
                  .from('opportunities')
                  .insert({
                    title: s.title,
                    institution: s.institution,
                    country: s.country,
                    description: s.description,
                    coverage: s.coverage,
                    language_level: s.language_level,
                    difficulty: s.difficulty,
                    category: s.category,
                    deadline: s.deadline ? new Date(s.deadline).toISOString() : null,
                    official_link: s.official_link,
                    is_verified: true,
                    coordinates: s.coordinates ? JSON.stringify(s.coordinates) : null,
                    created_at: new Date().toISOString()
                  })
                  .select('id').single()];
                case 1:
                  _b = _c.sent(), opp = _b.data, oppErr = _b.error;
                  if (oppErr || !opp) {
                    console.error("Error inserting ".concat(s.title), oppErr);
                    return [2 /*return*/, "continue"];
                  }
                  oppId = opp.id;
                  if (!s.fields) return [3 /*break*/, 3];
                  fieldInserts = s.fields.map(function (f) { return ({ opportunity_id: oppId, field_name: f }); });
                  if (s.careerField && !s.fields.includes(s.careerField)) {
                    fieldInserts.push({ opportunity_id: oppId, field_name: s.careerField });
                  }
                  return [4 /*yield*/, supabase.from('opportunity_fields').insert(fieldInserts)];
                case 2:
                  _c.sent();
                  _c.label = 3;
                case 3:
                  if (!s.requirements) return [3 /*break*/, 5];
                  reqInserts = s.requirements.map(function (r) { return ({ opportunity_id: oppId, description: r }); });
                  return [4 /*yield*/, supabase.from('requirements').insert(reqInserts)];
                case 4:
                  _c.sent();
                  _c.label = 5;
                case 5:
                  console.log("Inserted ".concat(s.title));
                  return [2 /*return*/];
              }
            });
          };
          _i = 0, mockScholarships_2 = mockScholarships_1.mockScholarships;
          _a.label = 1;
        case 1:
          if (!(_i < mockScholarships_2.length)) return [3 /*break*/, 4];
          s = mockScholarships_2[_i];
          return [5 /*yield**/, _loop_1(s)];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          console.log("Seeding COMPLETE.");
          return [2 /*return*/];
      }
    });
  });
}
seed().catch(console.error);
