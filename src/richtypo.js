import * as common from './common';

const { defs: defaultDefs, ...defaultRules } = common;

export const defaultRuleset = { defs: defaultDefs, rules: defaultRules };

const cleanupRules = {
  cleanup_before: [
    // Remove repeated spaces
    [/ {2,}/g, ' ']
  ],

  cleanup_after: [
    // Non-breaking space entity to symbol
    [/&nbsp;/g, '\xA0']
  ],

  textify: [
    [/<\/?[^>]+>/g, ''], // Remove tags
    [/&mdash;/g, '—'],
    [/[\x20\xA0]{2,}/g, ' '] // Repeated spaces [normal space + nbsp]
  ]
};

const saveTagsRe = [
  /<!(--\[[^\]>]+\]|\[[^\]>]+\]--)>/gim,
  /<!--[\s\S]*?-->/gim,
  /<pre[^>]*>[\s\S]*?<\/pre>/gim,
  /<style[^>]*>[\s\S]*?<\/style>/gim,
  /<script[^>]*>[\s\S]*?<\/script>/gim,
  /<code[^>]*>[\s\S]*?<\/code>/gim,
  /<[a-z/][^>]*>/gim
];

const restoreTagsRe = /<(\d+)>/g;

function replace(text, rules) {
  let processedText = text;
  rules.forEach(rule => {
    if (Array.isArray(rule[0])) {
      processedText = replace(processedText, rule);
    } else {
      processedText = processedText.replace(rule[0], rule[1]);
    }
  });
  return processedText;
}

function process(text, rulesets, rules) {
  let processedText = text;
  const rulesetArray = !Array.isArray(rulesets) ? [rulesets] : rulesets;

  const savedTags = [];

  // saving tags
  let savedTagsNum = 0;

  function save(tag) {
    savedTags[savedTagsNum] = tag;
    // rTag is <0>, <1>, <2>
    const rTag = `<${savedTagsNum}>`;
    savedTagsNum += 1;
    return rTag;
  }

  saveTagsRe.forEach(regex => {
    processedText = processedText.replace(regex, save);
  });

  // end of saving tags

  rulesetArray.forEach(rulename => {
    const rule = rules[rulename];
    if (typeof rule === 'function') {
      processedText = rule(processedText);
    } else if (rule) {
      processedText = replace(processedText, rule);
    }
    // console.log(
    //   'rule',
    //   rulename,
    //   text.replace(/\xA0/g, '__').replace(/\xAF/g, '_')
    // );
  });

  // restoring tags
  processedText = processedText
    .replace(restoreTagsRe, (_, num) => savedTags[num])
    // Remove double tags, like <abbr><abbr>JS</abbr></abbr>
    .replace(/<abbr>(<\1>[^<]+<\/\1>)<\/\1>/g, '$2');

  return processedText;
}

function computeDefs(defs) {
  // defs can be functions of other defs, so
  // we iterate through defs to compute them
  // based on previous key values.
  // This is not a super clear comment.

  const computedDefs = {};
  Object.entries(defs).forEach(([key, value]) => {
    if (typeof value === 'function') {
      computedDefs[key] = value(computedDefs);
    } else {
      computedDefs[key] = value;
    }
  });

  return computedDefs;
}

function compileRules(ruleset, defs) {
  const rulesets = {};

  function compileRule(obj, name) {
    if (typeof obj === 'string') {
      if (!rulesets[obj]) {
        throw new Error(
          `Rule "${obj}" mentioned in "${name}" not found. Available rules: ${Object.keys(
            rulesets
          ).join(', ')}`
        );
      }
      return rulesets[obj];
    }

    // if obj is a function, then we compute it through defs
    const rule = typeof obj === 'function' ? obj(defs) : obj;
    return [new RegExp(rule.regex, rule.flags || 'gmi'), rule.result];
  }

  Object.entries(ruleset).forEach(([name, rule]) => {
    let ruleArray = !Array.isArray(rule) ? [rule] : rule;

    ruleArray = ruleArray.map(r => compileRule(r, name));
    rulesets[name] = ruleArray;
  });

  // console.log('RULESETS', rulesets);

  return rulesets;
}

const richtypo = ({ defs, rules }, rulename) => {
  const computedDefs = computeDefs(defs);

  const compiledRules = Object.assign(
    {},
    cleanupRules,
    compileRules(rules, computedDefs)
  );

  if (rulename) {
    return text =>
      process(
        text,
        ['cleanup_before', rulename, 'cleanup_after'],
        compiledRules
      );
  }

  const rt = (rulename2, text) =>
    process(
      text,
      ['cleanup_before', rulename2, 'cleanup_after'],
      compiledRules
    );
  rt.all = text => process(text, Object.keys(compiledRules), compiledRules);

  return rt;
};

export default richtypo;
