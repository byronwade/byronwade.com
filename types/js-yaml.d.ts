declare module "js-yaml" {
	interface TypeDefinition {
		construct: (data: string) => Date;
		instanceOf?: typeof Date;
		kind: "scalar";
		represent?: (data: Date) => string;
		resolve: (data: unknown) => boolean;
	}

	class Type {
		tag: string;
		resolve: (data: unknown) => boolean;
		construct: (data: string) => Date;
		represent?: (data: Date) => string;
		constructor(tag: string, definition: TypeDefinition);
	}

	class Schema {
		compiledImplicit: Type[];
		constructor(definition: { include?: object[]; implicit?: Type[] });
	}

	interface Yaml {
		CORE_SCHEMA: Schema;
		DEFAULT_SAFE_SCHEMA: Schema;
		Schema: typeof Schema;
		safeLoad: (input: string, options?: { schema?: Schema }) => unknown;
		Type: typeof Type;
	}

	const yaml: Yaml;
	export = yaml;
}
