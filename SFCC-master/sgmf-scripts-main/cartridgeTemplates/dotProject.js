'use strict';

module.exports = (cartridgeName) => `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name>${cartridgeName}</name>
	<comment></comment>
	<projects>
	</projects>
	<buildSpec>
		<buildCommand>
			<name>com.demandware.studio.core.beehiveElementBuilder</name>
			<arguments>
			</arguments>
		</buildCommand>
	</buildSpec>
	<natures>
		<nature>com.demandware.studio.core.beehiveNature</nature>
	</natures>
</projectDescription>`;
