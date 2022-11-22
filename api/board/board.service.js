// const fs = require('fs')
const dbService = require('../../services/db.service')
const { makeId } = require('../../services/util.service')
// var gBoard = require('../../data/Board.json')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
    query,
    getById,
    add,
    update,
    remove
}

async function query(filterBy) {
    const criteria = {}
    if (filterBy) {
        const { title } = filterBy
        if (title) {
            const regex = new RegExp(title, 'i')
            criteria.name = { $regex: regex }
        }
    }
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find({}).toArray()
        if (!boards || !boards.length) boards = await collection.insertMany(gDefaultBoards)
        boards = await collection.find(criteria).toArray()
        return boards
    } catch (err) {
        console.log('ERROR: cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ _id: ObjectId(boardId) })
        // console.log('board from server')
        return board
    } catch (err) {
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
        return boardId
    } catch (err) {
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        board.labels = labelsData
        const addedBoard = await collection.insertOne(board)
        // console.log('FROM SERVER SERVICES', addedBoard.ops)
        return addedBoard.ops[0]
    } catch (err) {
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = { ...board, _id: ObjectId(board._id) }
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: boardToSave._id }, { $set: boardToSave })
        return boardToSave
    } catch (err) {
        throw err
    }
}

function _makeId(length = 5) {
    var txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
const labelsData = [
    {
        "id": "l101",
        "title": "",
        "color": "#7BC86C" // Green
    },
    {
        "id": "l102",
        "title": "",
        "color": "#F5DD29" //Yellow
    },
    {
        "id": "l103",
        "title": "",
        "color": "#FFAF3F" // Orange
    },
    {
        "id": "l104",
        "title": "",
        "color": "#EF7564"//Red
    },
    {
        "id": "l105",
        "title": "",
        "color": "#CD8DE5"//Purple
    },
    {
        "id": "l106",
        "title": "",
        "color": "#5BA4CF" //Blue
    }
]

const gDefaultBoards = [
    {
        "title": "Company Overview",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664197071/pawel-czerwinski-lKEvGdP0Oig-unsplash_xhxxbf.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "uNJDlX",
                "createdAt": 1664381690416.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    },
    {
        "title": "Project sTrello",
        "archivedAt": null,
        "isStarred": true,
        "createdAt": 1664381690416,
        "createdBy": {
            "_id": _makeId(),
            "fullname": "Maor Layani",
            "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03GZSLVC3Z-0637bd0f161c-512"
        },
        "style": {
            "bgColor": null,
            "imgUrl": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/bde90942b25945192718669aca01489b/photo-1662901603057-057ff15eb6eb.jpg"
        },
        "labels": labelsData,
        "members": [
            {
                "_id": "u101",
                "fullname": "Maor Layani",
                "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03GZSLVC3Z-0637bd0f161c-512"
            },
            {
                "_id": "u102",
                "fullname": "Nir Shvrchberg",
                "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03MSPLQ11T-d3d9e810a0d9-72"
            },
            {
                "_id": "u103",
                "fullname": "Risan Benichou",
                "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
            }
        ],
        "groups": [
            {
                "id": "g201",
                "title": "Backlog-Server",
                "archivedAt": null,
                "tasks": [
                    {
                        "id": "c201",
                        "title": "Create backend services"
                    },
                    {
                        "id": "c202",
                        "title": "Routing Directory",
                        "memberIds": ["u102"],
                        "style": {
                            "bg": {
                                "color": null,
                                "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664375512/marvin-meyer-SYTO3xs06fU-unsplash_s7stik.jpg",
                                "fullCover": false
                            }
                        },
                        "desc": "Complete user routing"
                    },
                    {
                        "id": "c203",
                        "title": "Socket implementation",
                        "labelIds": ["l105"],
                        "style": {
                            "bg": {
                                "color": "#ef7564",
                                "imgUrl": null,
                                "fullCover": false
                            }
                        },
                        "desc": "Complete Socket implementation after implementation beckend",
                        "checklists": [
                            {
                                "id": "OBU90u",
                                "title": "Socket implementation todos",
                                "todos": [
                                    {
                                        "id": "AFRdYo",
                                        "title": "Add socket service in backend",
                                        "isDone": true
                                    },
                                    {
                                        "id": "huiFGd",
                                        "title": "Add socket service in frontend",
                                        "isDone": true
                                    },
                                    {
                                        "id": "eT4qdY",
                                        "title": "Add socket to activities",
                                        "isDone": false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "c204",
                        "title": "Data Modal Approval",
                        "dueDate": {
                            "date": 16156215211,
                            "isDone": true,
                            "createdAt": 1590999730348
                        },
                    },
                    {
                        "id": "c205",
                        "title": "Create a server with express",
                        "style": {
                            "bg": {
                                "color": null,
                                "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664375608/taylor-vick-M5tzZtFCOfs-unsplash_fh1qzi.jpg",
                                "fullCover": false
                            }
                        },

                    }
                ],
                "style": {}
            },
            {
                "id": "g301",
                "title": "Backlog-Client",
                "archivedAt": null,
                "tasks": [
                    {
                        "id": "c302",
                        "title": "Add TaskDetails",
                        "labelIds": ["l101", "l103"],
                        "watcedMemberIds": ["u101"],
                    },
                    {
                        "id": "c303",
                        "title": "Adding npm libraries",
                        "labelIds": ["l101", "l103", "l104", "l106"],
                        "memberIds": ["u101", "u103"],
                        "watcedMemberIds": ["u101"]
                    },
                    {
                        "id": "c301",
                        "title": "Planning the components tree",
                        "labelIds": ["l101", "l103", "l104"],
                        "memberIds": ["u101", "u102", "u103"],
                        "watcedMemberIds": ["u101"],
                        "dueDate": {
                            "date": 1664485200000,
                            "isDone": false,
                            "createdAt": 1590999730348
                        },
                        "style": {
                            "bg": {
                                "color": "#7bc86c",
                                "imgUrl": null,
                                "fullCover": false
                            }
                        }
                    },
                    {
                        "id": "c304",
                        "title": "Build basic template",
                        "style": {
                            "bg": {
                                "color": null,
                                "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664375731/rodion-kutsaev-VKfqHv7qjNs-unsplash_ffegqb.jpg",
                                "fullCover": false
                            }
                        }
                    },
                    {
                        "id": "c305",
                        "title": "Implement Sass",
                        "desc": "Build full Sass architecture"
                    }
                ],
                "style": {}
            },
            {
                "id": "g401",
                "title": "In development",
                "archivedAt": null,
                "tasks": [
                    {
                        "id": "c401",
                        "title": "Functional testing for app header",
                        "labelIds": ["l103", "l104"],
                        "dueDate": {
                            "date": 1664744400000,
                            "isDone": true,
                            "createdAt": 1590999730348
                        },
                        "style": {
                            "bg": {
                                "color": "#ffaf3f",
                                "imgUrl": null,
                                "fullCover": false
                            }
                        }
                    },
                    {
                        "id": "c402",
                        "title": "Conecting to PWA",
                        "style": {
                            "bg": {
                                "color": null,
                                "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664383563/rahul-chakraborty-xsGxhtAsfSA-unsplash_mxl0ph.jpg",
                                "fullCover": false
                            }
                        },
                    }
                ],
                "style": {}
            },
            {
                "id": "g501",
                "title": "Done",
                "archivedAt": null,
                "tasks": [
                    {
                        "id": "c501",
                        "title": "CSS variables",
                        "labelIds": ["l101", "l103", "l106"],
                        "memberIds": ["u103"],
                        "style": {
                            "bg": {
                                "color": "#29cce5",
                                "imgUrl": null,
                                "fullCover": false
                            }
                        },
                        "desc": "Create css variables and helpers",
                        "attachments":
                            [
                                {
                                    id: 'at101',
                                    url: "https://www.w3schools.com/css/css3_variables.asp",
                                    urlName: 'nice pic',
                                    addedAt: new Date(),
                                }
                            ]
                    },
                    {
                        "id": "c502",
                        "title": "Making functions and mixins",
                        "labelIds": ["l101", "l105"],
                        "memberIds": ["u102"],
                        "attachments": [
                            { id: 'at102', url: "https://www.w3schools.com/cssref/css_functions.asp", urlName: 'css function', addedAt: new Date() },
                            { id: 'at103', url: "hhttps://www.w3schools.com/sass/sass_mixin_include.php", urlName: 'mixin include', addedAt: new Date() }

                        ]
                    },
                    {
                        "id": "c503",
                        "title": "CSS directory",
                        "dueDate": {
                            "date": 1664139600000,
                            "isDone": true,
                            "createdAt": 1590999730348
                        },
                    },
                    {
                        "id": "c504",
                        "title": "https://www.npmjs.com/package/@material-ui/core",
                    }
                ],
                "style": {}
            },
            {
                "id": "g601",
                "title": "QA",
                "archivedAt": null,
                "tasks": [
                    {
                        "id": "c601",
                        "title": "Meeting with head manager for planning the code progress",
                        "labelIds": ["l103", "l104"],
                        "desc": "Reviewing and fixing the code before the meeting"
                    },
                    {
                        "id": "c602",
                        "title": "End day code review with all members",
                        "labelIds": ["l103", "l104"],
                        "style": {
                            "bg": {
                                "color": "#29cce5",
                                "imgUrl": null,
                                "fullCover": false
                            }
                        }
                    },
                    {
                        "id": "c603",
                        "title": "Checking bugs",
                        "style": {
                            "bg": {
                                "color": null,
                                "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664434805/david-pupaza-heNwUmEtZzo-unsplash_cfv5uh.jpg",
                                "fullCover": false
                            }
                        },
                        "attachments": [{ id: 'at104', url: "https://en.wikipedia.org/wiki/Bugs", urlName: 'Bugs', addedAt: new Date() }]
                    },
                    {
                        "id": "c604",
                        "title": "Active from head manager",
                        "labelIds": ["l102", "l104"]
                    },
                    {
                        "id": "c605",
                        "title": "Inspector"
                    },
                    {
                        "id": "c606",
                        "title": "Assets"
                    }
                ],
                "style": {}
            },
            {
                "id": "g701",
                "title": "Ready for production",
                "archivedAt": null,
                "tasks": [
                    {
                        "id": "c701",
                        "title": "Creating database with mongo",
                        "labelIds": ["l104", "l106"],
                        "memberIds": ["u101", "u102", "u103"],
                        "watcedMemberIds": ["u101"],
                        "style": {
                            "bg": {
                                "color": null,
                                "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1663229153/code_mvpcmf.jpg",
                                "fullCover": false
                            }
                        },
                        "desc": "Create a connection to Atlas"
                    },
                    {
                        "id": "c702",
                        "title": "App header",
                        "labelIds": ["l102"],
                        "memberIds": ["u101", "u103"],
                        "watcedMemberIds": ["u101"],
                        "dueDate": {
                            "date": 16156215211,
                            "isDone": false,
                            "createdAt": 1599999730348
                        },
                    }
                ],
                "style": {}
            }
        ],
        "activities": [
            {
                "txt": "marked the due date on Functional testing for app header incomplete",
                "task": {
                    "id": "c401",
                    "title": ""
                },
                "id": "1QiPDg",
                "createdAt": 1664386021900.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            },
            {
                "task": {
                    "id": "c202",
                    "title": "Routing Directory"
                },
                "txt": "added Maor Layani to",
                "id": "4R3dZ7",
                "createdAt": 1664386019643.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            },
            {
                "task": {
                    "id": "c301",
                    "title": "Planning the components tree"
                },
                "txt": "remove Maor Layani from",
                "id": "BRGswL",
                "createdAt": 1664386013672.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            },
            {
                "txt": "marked the due date on Functional testing for app header complete",
                "task": {
                    "id": "c401",
                    "title": ""
                },
                "id": "Am26u9",
                "createdAt": 1664386005670.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            },
            {
                "txt": "marked the due date on Functional testing for app header incomplete",
                "task": {
                    "id": "c401",
                    "title": ""
                },
                "id": "9oXjL9",
                "createdAt": 1664386004891.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            },
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "cEhhV",
                "createdAt": 1664381690416.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ]
    },
    {
        "title": "Business plan",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664196414/ian-dooley-DJ7bWa-Gwks-unsplash_hr2qyq.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "gDtYTF",
                "createdAt": 1664382007857.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    },
    {
        "title": "Design sprint",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664187022/maxim-berg-Tba7ds4aF_k-unsplash_1_woirqi.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "xmGdh0",
                "createdAt": 1664382101960.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    },
    {
        "title": "Personal workout plan",
        "isStarred": true,
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664196200/alexander-sinn-KgLtFCgfC28-unsplash_viu9fl.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "jyH8nW",
                "createdAt": 1664382165380.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    },
    {
        "title": "My next vacation",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664186705/rrvviiii-EVEHo6gWzSM-unsplash_jqec7i.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "DIEwN3",
                "createdAt": 1664382260847.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    },
    {
        "_id": ObjectId("633475a65cc31f3f3c5169e6"),
        "title": "New Baby todos",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664197377/ash-from-modern-afflatus-NQ6Lh81BTRs-unsplash_qoe8no.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "9UH1ew",
                "createdAt": 1664382374891.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ],
        "isStarred": true
    },
    {
        "title": "Marketing overview",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664196528/jeremy-thomas-O6N9RV2rzX8-unsplash_ndcnyj.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "Wd7zZS",
                "createdAt": 1664382550504.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    },
    {
        "title": "Meal planning",
        "style": {
            "bgColor": null,
            "imgUrl": "https://res.cloudinary.com/dqhrqqqul/image/upload/v1664382696/katie-smith-uQs1802D0CQ-unsplash_dwxpri.jpg"
        },
        "activities": [
            {
                "txt": "created this board",
                "task": {
                    "task": "",
                    "title": ""
                },
                "id": "EdVySr",
                "createdAt": 1664382656822.0,
                "byMember": {
                    "_id": "63343b65c6b5a26b005fdacc",
                    "fullname": "Risan Benichou",
                    "imgUrl": "https://ca.slack-edge.com/T03E3RZ2KHV-U03KXR3PJD9-80fc7c6ab3fb-512"
                }
            }
        ],
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "#7BC86C"
            },
            {
                "id": "l102",
                "title": "",
                "color": "#F5DD29"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#FFAF3F"
            },
            {
                "id": "l104",
                "title": "",
                "color": "#EF7564"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#CD8DE5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5BA4CF"
            }
        ]
    }
]