
var changeStatus = [];

changeStatus['1'] = {
    name: 'Servicio generado por el cliente',
    isTecnico: true,
    id: 1
};

changeStatus['2'] = {
    name: 'Servicio tomado por un tecnico',
    isTecnico: true,
    id: 2
}

changeStatus['4'] = {
    name: ' Tecnico esperando valor del servicio',
    isTecnico: true,
    id: 4
}

changeStatus['5'] = {
    name: ' Tecnico ha aplazado el servicio. Vendra pronto',
    isTecnico: true,
    id: 5
}

changeStatus['6'] = {
    name: 'Servicio reservado por el cliente',
    isTecnico: true,
    id: 6
}


module.exports.changeStatus = changeStatus;