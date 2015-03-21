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
				short: 'G',
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
				short: 'SD',
                name: 'Крайний защитник',
                visible: ['def', 'spe', 'pas', 'tec', 'hea'],
                skills: {
                    def: 100,
                    spe: 75,
                    pas: 55,
                    tec: 50,
                    hea: 30
                } 
            },

            center_defender: {
				short: 'CD',
                name: 'Центральный защитник',
                visible: ['def', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    def: 100,
                    tec: 45,
                    spe: 45,
                    pas: 55,
                    hea: 55
                }
            },

            side_midfielder: {
				short: 'SM',
                name: 'Фланговый полузащитник',
                visible: ['mid', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    mid: 100,
                    sho: 30,
                    spe: 75,
                    pas: 60,
                    tec: 55,
                    hea: 30
                }
            },

            center_midfielder: {
				short: 'CM',
                name: 'Центральный полузащитник',
                visible: ['mid', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    mid: 100,
                    sho: 30,
                    tec: 70,
                    pas: 75,
                    spe: 30,
                    hea: 25
                }
            },

            side_forward: {
				short: 'SF',
                name: 'Фланговый нападающий',
                visible: ['off', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    off: 100,
                    sho: 65,
                    spe: 75,
                    tec: 75,
                    pas: 50,
                    hea: 30
                }
            },

            center_forward: {
				short: 'CF',
                name: 'Центральный нападающий',
                visible: ['off', 'sho', 'tec', 'spe', 'pas', 'hea'],
                skills: {
                    off: 100,
                    sho: 75,
                    spe: 75,
                    tec: 60,
                    pas: 30,
                    hea: 30
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
                visible: ['fip', 'sho', 'blk', 'pas', 'spe', 'tec', 'agr'],
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
                visible: ['fip', 'sho', 'blk', 'pas', 'spe', 'tec', 'agr'],
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
                visible: ['fip', 'sho', 'blk', 'pas', 'spe', 'tec', 'agr'],
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