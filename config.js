var Config = {

    hockey: {
        positions: {
            goalkeeper: {
                name: 'Вратарь',
                visible: ['goa', 'pas', 'tec'],
                skills: {
                    goa: 100,
                    pas: 50,
                    tec: 50
                }
            },
            deffender: {
                name: 'Защита',
                visible: ['def', 'sho', 'pas', 'tec', 'agr'],
                skills: {
                    def: 100,
                    pas: 50,
                    tec: 47,
                    agr: 50
                }
            },
            winger: {
                name: 'Крайний напад',
                visible: ['off', 'sho', 'tec', 'agr'],
                skills: {
                    off: 100,
                    sho: 70,
                    tec: 50,
                    agr: 50
                }
            },
            center: {
                name: 'Центр напад',
                visible: ['off', 'sho', 'pas', 'tec'],
                skills: {
                    off: 100,
                    sho: 50,
                    pas: 50,
                    tec: 50
                }
            }
        }
    },

    soccer: {
        positions: {
            goalkeeper: {
                name: 'Вратарь',
                visible: ['goa', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    goa: 100,
                    tec: 70,
                    spe: 70,
                    pas: 30,
                    hea: 40
                }
            },

            side_defender: {
                name: 'Крайний защитник',
                visible: ['def', 'spe', 'pas', 'tec', 'hea'],
                skills: {
                    def: 100,
                    spe: 70,
                    pas: 50,
                    tec: 50,
                    hea: 25
                }
            },

            center_defender: {
                name: 'Центральный защитник',
                visible: ['def', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    def: 100,
                    tec: 60,
                    spe: 50,
                    pas: 50,
                    hea: 60
                }
            },

            side_midfielder: {
                name: 'Фланговый полузащитник',
                visible: ['mid', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    mid: 100,
                    spe: 70,
                    pas: 50,
                    tec: 50,
                    hea: 25
                }
            },

            center_midfielder: {
                name: 'Центральный полузащитник',
                visible: ['mid', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    mid: 100,
                    tec: 70,
                    pas: 70,
                    spe: 30,
                    hea: 30
                }
            },

            side_forward: {
                name: 'Фланговый нападающий',
                visible: ['off', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    off: 100,
                    sho: 70,
                    spe: 70,
                    tec: 70,
                    pas: 50,
                    hea: 25
                }
            },

            center_forward: {
                name: 'Центральный нападающий',
                visible: ['off', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    off: 100,
                    sho: 70,
                    spe: 70,
                    tec: 50,
                    pas: 25,
                    hea: 25
                }
            }
        }
    },

    handball: {
        positions: {
            goalkeeper: {
                name: 'Вратарь',
                visible: ['goa', 'blk', 'pas', 'tec', 'spe'],
                skills: {
                    goa: 100,
                    blk: 70,
                    pas: 50,
                    tec: 30,
                    spe: 30
                }
            },

            back: {
                name: 'Центральный',
                visible: ['fip', 'sho', 'pas', 'spe', 'tec', 'agr'],
                skills: {
                    fip: 100,
                    pas: 70,
                    tec: 50,
                    spe: 30,
                    agr: 30
                }
            },

            pivot: {
                name: 'Линейный',
                visible: ['fip', 'sho', 'pas', 'spe', 'tec', 'agr'],
                skills: {
                    fip: 100,
                    agr: 70,
                    tec: 50,
                    spe: 30,
                    pas: 30
                }
            },

            wing: {
                name: 'Крайний',
                visible: ['fip', 'sho', 'pas', 'spe', 'tec', 'agr'],
                skills: {
                    fip: 100,
                    spe: 70,
                    tec: 50,
                    pas: 30,
                    agr: 30
                }
            }
        }
    }
};

Config.get = function (sport, param) {

    if (sport in Config === false) {
        return null;
    }

    if (param in Config[sport] === false) {
        return null;
    }

    return Config[sport][param];
};