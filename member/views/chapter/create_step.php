<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model common\models\comic\Chapter */

$this->title = \Yii::t('member', 'Create Comic');
$this->params['subTitle'] = $this->title;
?>

<div class="row chapter-create">
    <div class="col-md-12">
        <div class="portlet light">
            <div class="portlet-title">
                <div class="caption">
                    <i class="icon-settings"></i><?= $this->params['subTitle'] ?>
                </div>
                <div class="actions btn-set">
                </div>

            </div>
            <div class="mt-element-step">
                <div class="row step-thin">
                    <div class="col-lg-3 bg-grey done mt-step-col">
                        <div class="mt-step-number bg-white font-grey">1</div>
                        <div class="mt-step-title uppercase font-grey-cascade">创建漫画</div>
                        <div class="mt-step-content font-grey-cascade">设置漫画基本信息</div>
                    </div>
                    <div class="col-lg-3 bg-grey done mt-step-col">
                        <div class="mt-step-number bg-white font-grey">2</div>
                        <div class="mt-step-title uppercase font-grey-cascade">上传封面</div>
                        <div class="mt-step-content font-grey-cascade">设置漫画封面</div>
                    </div>
                    <div class="col-lg-3 bg-grey active mt-step-col">
                        <div class="mt-step-number bg-white font-grey">3</div>
                        <div class="mt-step-title uppercase font-grey-cascade">创建章节</div>
                        <div class="mt-step-content font-grey-cascade">上传漫画图片</div>
                    </div>
                    <div class="col-lg-3 bg-grey mt-step-col">
                        <div class="mt-step-number bg-white font-grey">4</div>
                        <div class="mt-step-title uppercase font-grey-cascade">创建成功</div>
                        <div class="mt-step-content font-grey-cascade">等待客服审核</div>
                    </div>
                </div>
            </div>

            <div style="height: 10px;"></div>
            <?php
            $categories = \common\models\comic\ChapterCategory::categoriesArray();
            echo $this->render('_form', ['model' => $model, 'categories' => $categories, 'isCreateComic' => true]);
            ?>

        </div>
    </div>
</div>