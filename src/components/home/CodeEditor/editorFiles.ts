export type TokenType =
  | 'keyword'
  | 'func'
  | 'type'
  | 'string'
  | 'number'
  | 'property'
  | 'variable'
  | 'operator'
  | 'punct'
  | 'comment';

export interface Token {
  text: string;
  type?: TokenType; // omit → default editor text color
  bold?: boolean; // `return` + declared/exported identifiers
  tip?: string; // hover/focus tooltip
}

export type Line = Token[];

export interface EditorFile {
  name: string;
  lines: Line[];
}

// Compact token constructors keep the content readable.
const kw = (text: string, bold = false): Token => ({ text, type: 'keyword', bold });
const fn = (text: string, bold = false, tip?: string): Token => ({ text, type: 'func', bold, tip });
const ty = (text: string, bold = false): Token => ({ text, type: 'type', bold });
const str = (text: string, tip?: string): Token => ({ text, type: 'string', tip });
const num = (text: string, tip?: string): Token => ({ text, type: 'number', tip });
const prop = (text: string, tip?: string): Token => ({ text, type: 'property', tip });
const vr = (text: string, bold = false, tip?: string): Token => ({ text, type: 'variable', bold, tip });
const op = (text: string): Token => ({ text, type: 'operator' });
const p = (text: string): Token => ({ text, type: 'punct' });
const cm = (text: string): Token => ({ text, type: 'comment' });
const tx = (text: string): Token => ({ text }); // whitespace / default

export const aboutFile: EditorFile = {
  name: 'about.ts',
  lines: [
    [cm('/** Full-stack developer turned AI engineer.')],
    [cm(' *  Shipping production LLM systems & enterprise web apps. */')],
    [],
    [kw('const'), tx(' '), vr('developer', true), tx(' '), op('='), tx(' '), p('{')],
    [tx('  '), prop('name'), p(':'), tx(' '), str('"Defang"'), p(',')],
    [
      tx('  '),
      prop('role', 'Two hats — I build the model layer and the pixels.'),
      p(':'),
      tx(' '),
      str('"AI Engineer | Full Stack Developer"'),
      p(','),
    ],
    [tx('  '), prop('sex'), p(':'), tx(' '), str('"male"'), p(','), tx('          '), cm('// ♂')],
    [
      tx('  '),
      prop('age', 'Hex flex: 0x1A === 26.'),
      p(':'),
      tx(' '),
      num('0x1A', '0x1A === 26'),
      p(','),
      tx('            '),
      cm('// 26, because hex is cooler'),
    ],
    [
      tx('  '),
      prop('focus'),
      p(':'),
      tx(' '),
      p('['),
      str('"multi-agent backends"'),
      p(','),
      tx(' '),
      str('"generative UI"'),
      p(']'),
      p(','),
    ],
    [p('}'), tx(' '), kw('satisfies'), tx(' '), ty('Developer'), p(';')],
    [],
    [
      kw('export'),
      tx(' '),
      kw('function'),
      tx(' '),
      fn('currentlyBuilding', true, 'What I ship after hours.'),
      p('('),
      p(')'),
      tx(' '),
      p('{'),
    ],
    [tx('  '), kw('return', true), tx(' '), p('[')],
    [tx('    '), str('"AI-driven Agentic ERP — multi-agent workflows + Generative UI"'), p(',')],
    [
      tx('    '),
      str(
        '"Info Radar — AI news, distilled into a daily digest"',
        'My daily AI-news radar — the Horizon digest on this site.',
      ),
      p(','),
    ],
    [tx('  '), p(']'), p(';')],
    [p('}')],
  ],
};

export const beliefsFile: EditorFile = {
  name: 'beliefs.ts',
  lines: [
    [
      kw('type'),
      tx(' '),
      ty('Belief', true),
      tx(' '),
      op('='),
      tx(' '),
      p('{'),
      tx(' '),
      prop('principle'),
      p(':'),
      tx(' '),
      ty('string'),
      p(';'),
      tx(' '),
      prop('because'),
      p(':'),
      tx(' '),
      ty('string'),
      p(';'),
      tx(' '),
      p('}'),
      p(';'),
    ],
    [],
    [
      kw('export'),
      tx(' '),
      kw('const'),
      tx(' '),
      vr('beliefs', true, 'What I optimize for, in order.'),
      p(':'),
      tx(' '),
      ty('Belief'),
      p('['),
      p(']'),
      tx(' '),
      op('='),
      tx(' '),
      p('['),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"Ship, then learn"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"Real feedback from production beats any amount of planning."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"Build end-to-end"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"Context collapse across layers is where the real problems live."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"Learn in public"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"If I can\'t explain what I built, I don\'t fully understand it yet."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"AI is the craft"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"Not a tool I use — the thing I think about most."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [p(']'), p(';')],
    [],
    [
      kw('export'),
      tx(' '),
      kw('function'),
      tx(' '),
      fn('whatIBelieve', true),
      p('('),
      p(')'),
      tx(' '),
      p('{'),
    ],
    [
      tx('  '),
      kw('return', true),
      tx(' '),
      vr('beliefs'),
      p('.'),
      fn('map'),
      p('('),
      p('('),
      vr('b'),
      p(')'),
      tx(' '),
      op('=>'),
      tx(' '),
      vr('b'),
      p('.'),
      prop('principle'),
      p(')'),
      p(';'),
    ],
    [p('}')],
  ],
};
