import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
			"bg-background border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-muted/50 disabled:text-muted-foreground h-10 rounded-lg border px-3 py-2 text-sm transition-all duration-200 file:h-7 file:text-sm file:font-medium focus-visible:ring-2 focus-visible:mira-input-focus aria-invalid:ring-2 file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 mira-search",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
