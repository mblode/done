import { useZero as useZeroBase } from "@rocicorp/zero/react";

import type { Schema, ZeroContext } from "@/schema";

export const useZero = () => useZeroBase<Schema, undefined, ZeroContext>();
