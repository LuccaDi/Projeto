jQuery(document).ready(function ()
{

    function restoreRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
            oTable.fnUpdate(aData[i], nRow, i, false);
        }

        oTable.fnDraw();
    }

    function editRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[0] + '">';
        jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[1] + '">';
        jqTds[2].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[2] + '">';
        jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
        jqTds[4].innerHTML = '<a class="edit" href="">Salvar</a>';
        jqTds[5].innerHTML = '<a class="cancel" href="">Cancelar</a>';
    }

    function saveRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
        oTable.fnUpdate('<a class="edit" href="">Editar</a>', nRow, 4, false);
        oTable.fnUpdate('<a class="delete" href="">Deletar</a>', nRow, 5, false);
        oTable.fnDraw();
    }

    function cancelEditRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
        oTable.fnUpdate('<a class="edit" href="">Editar</a>', nRow, 4, false);
        oTable.fnDraw();
    }

    var table = $('#sample_editable_1');

    var oTable = table.dataTable({

        "lengthMenu": [
            [5, 15, 20, -1],
            [5, 15, 20, "All"] // change per page values here
        ],
        // set the initial value
        "pageLength": 10,

        "language": {

            "lengthMenu": "_MENU_",
            "zeroRecords": "Nenhum usuário encontrado",
            "info": "Mostrar page _PAGE_ de _PAGES_",
            "infoFilteostrar page _PAGE_ de _PAGES_red": "(filtered from _MAX_ total records)",
            "sInfoEmpty": "Mostrar 0 de 0",
            "sSearch": "Buscar:"
        },
        "columnDefs": [{// set default column settings
                'orderable': true,
                'targets': [0]
            }, {
                "searchable": true,
                "targets": [0]
            }],
        "order": [
            [0, "asc"]
        ] // set first column as a default sort by asc
    });

    var tableWrapper = $("#sample_editable_1_wrapper");

    tableWrapper.find(".dataTables_length select").select2({
        showSearchInput: false //hide search box with special css class
    }); // initialize select2 dropdown

    var nEditing = null;
    var nNew = false;

    $('#sample_editable_1_new').click(function (e) {
        e.preventDefault();

        if (nNew && nEditing) {
            if (confirm("Linha não salva. Você deseja salvar ?")) {
                saveRow(oTable, nEditing); // save
                $(nEditing).find("td:first").html("Untitled");
                nEditing = null;
                nNew = false;

            } else {
                oTable.fnDeleteRow(nEditing); // cancel
                nEditing = null;
                nNew = false;

                return;
            }
        }

        var aiNew = oTable.fnAddData(['', '', '', '', '', '']);
        var nRow = oTable.fnGetNodes(aiNew[0]);
        editRow(oTable, nRow);
        nEditing = nRow;
        nNew = true;
    });

    table.on('click', '.delete', function (e) {
        e.preventDefault();

        if (confirm("Você tem certeza que deseja deletar isso?") == false) {
            return;
        }

        var nRow = $(this).parents('tr')[0];
        oTable.fnDeleteRow(nRow);
        alert("Deleted! Do not forget to do some ajax to sync with backend :)");
    });

    table.on('click', '.cancel', function (e) {
        e.preventDefault();

        if (nNew) {
            oTable.fnDeleteRow(nEditing);
            nNew = false;
        } else {
            restoreRow(oTable, nEditing);
            nEditing = null;
        }
    });

    table.on('click', '.edit', function (e) {
        e.preventDefault();

        /* Get the row as a parent of the link that was clicked on */
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
            /* Currently editing - but not this row - restore the old before continuing to edit mode */
            restoreRow(oTable, nEditing);
            editRow(oTable, nRow);
            nEditing = nRow;
        } else if (nEditing == nRow && this.innerHTML == "Save") {
            /* Editing this row and want to save it */
            saveRow(oTable, nEditing);
            nEditing = null;
            alert("Updated! Do not forget to do some ajax to sync with backend :)");
        } else {
            /* No edit in progress - let's start one */
            editRow(oTable, nRow);
            nEditing = nRow;
        }
    });
});