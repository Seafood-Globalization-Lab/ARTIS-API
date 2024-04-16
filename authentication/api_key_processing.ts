
// Generates a new 32 character API key (potential characters: 0-9,a-z)
export const generate_key = (base = 36) => {

    const new_key : string = [...Array(32)]
        .map((val) => {
            return Math.floor(Math.random() * base).toString(base)
        })
        .join("");

    return new_key
};


