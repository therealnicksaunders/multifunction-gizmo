export const map: <A, B>(f: (a: A) => B) => (ma: PromiseLike<A>) => PromiseLike<B> = f => ma => ma.then(f);
