import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"bg-background border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-muted/50 disabled:text-muted-foreground rounded-lg border px-3 py-3 text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:mira-input-focus aria-invalid:ring-2 placeholder:text-muted-foreground flex field-sizing-content min-h-20 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none mira-search",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
