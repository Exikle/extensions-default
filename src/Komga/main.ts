import { Komga as _Komga } from "./Komga";

import { CompatWrapper } from "@paperback/types/lib/compat/0.8";

export const Komga = CompatWrapper(
    { registerHomeSectionsInInitialise: true },
    new _Komga(undefined),
);
