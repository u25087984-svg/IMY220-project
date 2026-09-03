const posts = [
    {
        id: 1,
        username: "@sarah",
        caption: "Studying React today!",
        image:  "/images/robot.jpg",
        comments: [
            { id: 1, commUname: "@geff_Lion", comment: "I am in love with you" },
            { id: 2, commUname: "@Leven_Kevin", comment: "Amazing work!" },
            { id: 3, commUname: "@Stevel_Bevel", comment: "Where are the dogs??" }
        ]
    },
    {
        id: 2,
        username: "@john",
        caption: "Finished Practical 4.",
        image:  "/images/robot.jpg",
        comments: [
            { id: 4, commUname: "@Ronny_Lin", comment: "You are fantastic" },
            { id: 5, commUname: "@Leeeeeroy", comment: "Jenkins!" },
            { id: 6, commUname: "@Climpus_Splendis", comment: "I have potions for you!" }
        ]
    },
    {
        id: 3,
        username: "@leanne",
        caption: "Sunset over campus.",
        image:  "/images/robot.jpg",
        comments: [
            { id: 7, commUname: "@Box_Man", comment: "Come to my house!" },
            { id: 8, commUname: "@Aint_no_way", comment: "Yeah, right" },
            { id: 9, commUname: "@Biggest_Bone", comment: "Stupidity utterly and entirely" }
        ]
    },
    {
        id: 4,
        username: "@leanne",
        caption: "My favourite river.",
        image:  "/images/robot.jpg",
        comments: [
            { id: 10, commUname: "@Manman", comment: "I don't think that's correct" },
            { id: 11, commUname: "@LebronJones", comment: "I can basketball" },
            { id: 12, commUname: "@PuppyDogKittenRaindbow", comment: "I don't like you" }
        ]
    }
];

const users = [
    {
        id: 1,
        username: "@sarah",
        password: "Password123",
        profilePic:  "/images/robot.jpg",
        bio: "React enthusiast. Coffee-powered.",
        posts: [1],
        friends: [2, 3]
    },
    {
        id: 2,
        username: "@john",
        password: "KrampusBiggest345",
        profilePic:  "/images/robot.jpg",
        bio: "Practical 4 survivor.",
        posts: [2],
        friends: [1]
    },
    {
        id: 3,
        username: "@leanne",
        password: "ILoveBananas24",
        profilePic:  "/images/robot.jpg",
        bio: "Sunsets and rivers.",
        posts: [3, 4],
        friends: [1]
    }
];

export { posts, users };