// Helper functions.
const multiply = (acc, cur) => acc * cur;
const map = fn => arr => arr.map(fn);
const sort = fn => arr => [...arr].sort(fn);
const compose = (...funcs) => data => 
  funcs.reduceRight((acc, cur) => cur(acc), data);

// substitute :: (String, [Number]) -> (Number -> String | Number)
const substitute = (str, multiples) =>
  n => (n % multiples.reduce(multiply) === 0 ? str : n);

// concatPairs :: ([[Number], String], [[Number], String]) -> [[Number], String]
const concatPairs = (pair1, pair2) => {
  const [nums1, str1] = pair1;
  const [nums2, str2] = pair2;
  return [nums1.concat(nums2), `${str1}${str2}`];
};

// combinePairs :: [[[Number], String]] -> [[[Number], String]]
const combinePairs = (pairs) => {
  const headPair = pairs[0];
  if (pairs.length === 1) {
    return [headPair];
  };
  const tail = combinePairs(pairs.slice(1));
  const combinedTail = tail.map(tailPair => concatPairs(headPair, tailPair));
  return tail.concat(combinedTail, [headPair]);
};

// makeConverter :: [[Number, String]] -> (Number -> String | Number)
const makeConverter = compose(
  funcs => compose(...funcs),
  map(([numbers, string]) => substitute(string, numbers)),
  sort(([nums1], [nums2]) => nums1.length - nums2.length),
  combinePairs,
  map(([num, str]) => [[num], str]),
);

// makeCounter :: [[Number, String]] -> (Number, Number, Number?) -> Iterator
function makeCounter(pairs) {
  const convert = makeConverter(pairs);
  return function* counter(start, end, current = start) {
    let loop = yield convert(current);
    if (current < end) {
      const value = yield* counter(start, end, current + 1);
      loop = value !== undefined;
    }
    if (loop) {
      yield* counter(start, end);
    }
    return;
  }
}
