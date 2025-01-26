# ชื่อ stack ที่จะใช้สำหรับการ deploy
STACK_NAME := okd-pos1-stack

# ชื่อ S3 bucket ที่จะใช้เก็บโค้ดของ Lambda function
S3_BUCKET := okd-pos1

# ชื่อไฟล์ template ของ SAM
TEMPLATE := template.yaml

LAYER_NAME := AuthLayer

delete-layer-version:
	aws lambda delete-layer-version --layer-name $(LAYER_NAME) --version-number 11

# คำสั่งสำหรับการ build โปรเจกต์
build:
	sam build --template $(TEMPLATE)

# คำสั่งสำหรับการ deploy โปรเจกต์
deploy:
	sam deploy \
	--stack-name $(STACK_NAME) \
	--s3-bucket $(S3_BUCKET) \
	--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
	--region ap-southeast-1 \
	--no-confirm-changeset

#	--parameter-overrides \
#	MongoDbUri=your-mongodb-uri \
#	JwtSecret=your-jwt-secret-key \
# คำสั่งสำหรับการ deploy แบบ guided
deploy-guided:
	sam deploy --guided --stack-name $(STACK_NAME) --s3-bucket $(S3_BUCKET)

# คำสั่งสำหรับการลบ stack ของ AWS SAM
delete:
	aws cloudformation delete-stack --stack-name $(STACK_NAME)

# คำสั่งสำหรับการลบไฟล์ที่สร้างจาก build
clean:
	sam delete --stack-name $(STACK_NAME)
	rm -rf .aws-sam

# รันการทดสอบใน local
local-invoke:
	sam local invoke "LoginFunction" -e events/login_event.json

# ดู logs ของ Lambda function
logs:
	sam logs -n LoginFunction --stack-name $(STACK_NAME) --tail