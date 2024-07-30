// utils/validateInput.js
export const prohibitedWords = [
    "abuse", "hate", "violence", "racist", "sexist", "terrorism", "child abuse",
    "bullying", "harassment", "slur", "profanity", "extremism", "xenophobia",
    "homophobia", "transphobia", "misogyny", "assault", "murder", "suicide",
    "self-harm", "pornography", "obscenity", "defamation", "slander",
    "libel", "discrimination", "exploitation", "trafficking", "incest",
    "pedophilia", "necrophilia", "bestiality", "drugs", "narcotics",
    "weapons", "explosives", "blackmail", "bribery", "fuck", "shit",
    "bitch", "bastard", "whore", "slut", "cunt", "asshole", "dick",
    "pussy", "faggot", "nigger", "retard", "chink", "spic", "kike",
    "gook", "dyke", "tranny", "shemale", "cripple", "mongoloid", "twat",
    "wanker", "tosser", "bollocks", "bugger", "bollocks", "wog", "paki",
    "camel jockey", "raghead", "towelhead"
];

export function validateInput(input:any) {
    const lowercasedInput = input.toLowerCase();
    for (const word of prohibitedWords) {
        if (lowercasedInput.includes(word)) {
            return false;
        }
    }
    return true;
}
