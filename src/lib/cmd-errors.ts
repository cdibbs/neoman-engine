import * as c from 'commandpost';

export let cmdErrors: { [key: string]: (err: c.CommandpostError) => string } = {};
cmdErrors[c.ErrorReason.ArgumentRequired] = (err) => `Argument ${firstPart(err)} is required.`;
cmdErrors[c.ErrorReason.ArgumentsRequired] = (err) => `Arguments ${allParts(err)} are required.`;
cmdErrors[c.ErrorReason.OptionNameMismatch] = (err) => `Option name ${firstPart(err)} doesn't match.`;
cmdErrors[c.ErrorReason.OptionValueRequired] = (err) => `Value required for option ${firstPart(err)}.`;
cmdErrors[c.ErrorReason.ParameterCannPlacedAfterOptional] = (err) => `Parameter ${firstPart(err)} cannot be placed after optional parameter.`;
cmdErrors[c.ErrorReason.ParameterCantPlacedAfterVariadic] = cmdErrors[c.ErrorReason.ParameterCannPlacedAfterOptional];
cmdErrors[c.ErrorReason.UnknownOption] = (err) => `Option(s) ${allParts(err)} are unknown.`;
cmdErrors[c.ErrorReason.UnsupportedFormatArgument] = (err) => `Internal error. Unsupported format: ${firstPart(err)}.`;

let firstPart = (err: c.CommandpostError) => err && err.params && err.params.parts && err.params.parts[0] || "[unknown]";
let allParts = (err: c.CommandpostError) => err && err.params && err.params.parts && err.params.parts.join(', ') || "[unknown]";
