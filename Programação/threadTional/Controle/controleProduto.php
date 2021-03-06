<?php

include '../Modelo/DB.php';
$db = new DB();
$tblName = 'produto';
if (isset($_POST['action_type']) && !empty($_POST['action_type'])) {
    if ($_POST['action_type'] == 'data') {
        $conditions['where'] = array('id' => $_POST['id']);
        $conditions['return_type'] = 'single';
        $user = $db->getRows($tblName, $conditions);
        echo json_encode($user);
    } elseif ($_POST['action_type'] == 'view') {
        $users = $db->getRows($tblName, array('order_by' => 'codigoProduto ASC'));
        if (!empty($users)) {
            $count = 0;
            foreach ($users as $user): $count++;
            echo '';
                echo '<tr>';
                echo '<td>#' . $count . '</td>';
                echo '<td>' . $user['idUsuario'] . '</td>';
                echo '<td>' . $user['nome'] . '</td>';



                echo '<td><a href="javascript:void(0);" class="glyphicon glyphicon-edit" onclick="editUser(\'' . $user['id'] . '\')"></a><a href="javascript:void(0);" class="glyphicon glyphicon-trash" onclick=" $(\'#delete_confirm_modal\').modal(\'show\'); deletar(\'' . $user['id'] . '\');"></a><!--<a href="javascript:void(0);" class=" glyphicon glyphicon-calendar" onclick="calendario(\'' . $user['idUsuario'] . '\');"></a></td>-->';
                echo '</tr>';
            endforeach;
        }else {
            echo '<tr><td colspan="5">Nenhum usuário encontrado ......</td></tr>';
        }
    } elseif ($_POST['action_type'] == 'add') {
        if (!empty($_POST['idUsuario']) && !empty($_POST['nome'])) {
            $users1 = $db->getRows($tblName, array('idUsuario' => $_POST['idUsuario']));
            $verificar2 = true;
            if (!empty($users1)) {
                //echo $_POST['periodo']." ";
                foreach ($users1 as $user2) {
                    if ($_POST['idUsuario'] == $user2['idUsuario']) {
                        $verificar2 = false;
                    }
                }
            }
            if ($verificar2 == false) {
                    echo '<h2>Usuário já cadastrado!</h2>';
            } else {
                $userData = array(
                    'idUsuario' => $_POST['idUsuario'],
                    'nome' => $_POST['nome']
                );

                $insert = $db->insert($tblName, $userData);
                echo $insert ? 'ok' : 'err';
            }
        } else {
            echo '<h2>Preencha todos os dados!</h2>';
        }
    } elseif ($_POST['action_type'] == 'edit') {
        //echo $_POST['id']." ".$_POST['idUsuario']." ".$_POST['nome'];
        if (!empty($_POST['id']) && !empty($_POST['idUsuario']) && !empty($_POST['nome'])) {
            $userData = array(
                'nome' => $_POST['nome']
            );
            $condition = array('id' => $_POST['id']);
            $update = $db->update($tblName, $userData, $condition);
           // echo "<script>alert($update)</script>";
            echo $update?'ok':'err';
        }  else {
            echo '<h2>Preencha todos os dados!</h2>';

          }
    } elseif ($_POST['action_type'] == 'delete') {
        if (!empty($_POST['id'])) {
            $condition = array('id' => $_POST['id']);
            $delete = $db->delete($tblName, $condition);
            echo $delete ? 'ok' : 'err';
        }
    } elseif ($_POST['action_type'] == 'verificar') {
        if (!empty($_POST['id'])) {
            $verificar = $db->verificar($_POST['id']);
            if ($verificar == 'err') {
                echo 'err';
            } else {
                echo $verificar;
            }
        }
    }
    exit;
}
?>